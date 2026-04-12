import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { inputAspirasiService } from '@/services/api';

interface Notification {
  id: string;
  type: 'new_complaint' | 'status_update' | 'response';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  linkTo?: string;
  soundPlayed?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  soundEnabled: boolean;
  toggleSound: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  lastRefresh: Date;
  refreshNow: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// ==================== LOCALSTORAGE HELPERS ====================
const STORAGE_KEY_READ = 'susi_readNotifications';
const STORAGE_KEY_DISMISSED = 'susi_dismissedNotifications';

const getReadIds = (): Set<string> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_READ);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const saveReadIds = (ids: Set<string>) => {
  try {
    // Keep only the latest 100 IDs to prevent localStorage bloat
    const arr = Array.from(ids).slice(-100);
    localStorage.setItem(STORAGE_KEY_READ, JSON.stringify(arr));
  } catch {
    // Ignore storage errors
  }
};

const getDismissedIds = (): Set<string> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_DISMISSED);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const saveDismissedIds = (ids: Set<string>) => {
  try {
    const arr = Array.from(ids).slice(-200);
    localStorage.setItem(STORAGE_KEY_DISMISSED, JSON.stringify(arr));
  } catch {
    // Ignore storage errors
  }
};

// ==================== AUDIO ====================
let notificationAudio: HTMLAudioElement | null = null;

const getNotificationAudio = (): HTMLAudioElement => {
  if (!notificationAudio) {
    notificationAudio = new Audio('/assets/nada_notif.mp3');
    notificationAudio.volume = 0.7;
  }
  return notificationAudio;
};

const playNotificationSound = () => {
  try {
    const audio = getNotificationAudio();
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch (e) {
    console.log('Audio play failed:', e);
  }
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = localStorage.getItem('notificationSound');
    return stored !== 'false';
  });
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { siswa, admin, role } = useAuth();
  
  // Track notification IDs that have already played sound
  const playedSoundsRef = useRef<Set<string>>(new Set());
  // Track read IDs from localStorage
  const readIdsRef = useRef<Set<string>>(getReadIds());
  // Track dismissed IDs (cleared notifications)
  const dismissedIdsRef = useRef<Set<string>>(getDismissedIds());

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('notificationSound', String(newValue));
      return newValue;
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    readIdsRef.current.add(id);
    saveReadIds(readIdsRef.current);
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      prev.forEach(n => readIdsRef.current.add(n.id));
      saveReadIds(readIdsRef.current);
      return prev.map(n => ({ ...n, read: true }));
    });
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications(prev => {
      prev.forEach(n => dismissedIdsRef.current.add(n.id));
      saveDismissedIds(dismissedIdsRef.current);
      return [];
    });
    playedSoundsRef.current.clear();
  }, []);

  // Check for new notifications (polling)
  const checkNotifications = useCallback(async () => {
    try {
      let hasNewNotification = false;

      if (role === 'siswa' && siswa) {
        const response = await inputAspirasiService.getBySiswa(siswa.nis);
        if (response.success) {
          const complaints = response.data;
          complaints.forEach(complaint => {
            if (complaint.aspirasi && complaint.aspirasi.length > 0) {
              const latestAspirasi = complaint.aspirasi[0];
              const notifId = `response-${complaint.id_pelaporan}-${latestAspirasi.id_aspirasi}-${latestAspirasi.status}`;
              
              // Skip dismissed notifications
              if (dismissedIdsRef.current.has(notifId)) return;
              
              setNotifications(prev => {
                const exists = prev.some(n => n.id === notifId);
                
                if (!exists && (latestAspirasi.detail_tanggapan || latestAspirasi.status !== 'Menunggu')) {
                  const isRead = readIdsRef.current.has(notifId);
                  const newNotif: Notification = {
                    id: notifId,
                    type: latestAspirasi.status === 'Selesai' ? 'status_update' : 'response',
                    title: latestAspirasi.status === 'Selesai' ? 'Pengaduan Selesai!' : 'Update Status',
                    message: `Pengaduan #${complaint.id_pelaporan}: ${latestAspirasi.status}`,
                    timestamp: new Date(),
                    read: isRead,
                    linkTo: `/student/complaints/${complaint.id_pelaporan}`,
                    soundPlayed: isRead,
                  };
                  
                  if (!isRead && soundEnabled && !playedSoundsRef.current.has(notifId)) {
                    playedSoundsRef.current.add(notifId);
                    hasNewNotification = true;
                  }
                  
                  return [newNotif, ...prev.slice(0, 19)];
                }
                return prev;
              });
            }
          });
        }
      } else if (role === 'admin' && admin) {
        const response = await inputAspirasiService.getAll();
        if (response.success) {
          const complaints = response.data;
          const newComplaints = complaints.filter(c => !c.aspirasi || c.aspirasi.length === 0);
          
          newComplaints.slice(0, 5).forEach(complaint => {
            const notifId = `new-complaint-${complaint.id_pelaporan}`;
            
            // Skip dismissed notifications
            if (dismissedIdsRef.current.has(notifId)) return;
            
            setNotifications(prev => {
              const exists = prev.some(n => n.id === notifId);
              
              if (!exists) {
                const isRead = readIdsRef.current.has(notifId);
                const newNotif: Notification = {
                  id: notifId,
                  type: 'new_complaint',
                  title: 'Pengaduan Baru',
                  message: `${complaint.siswa?.nama || 'Siswa'}: ${complaint.keterangan.substring(0, 40)}...`,
                  timestamp: new Date(),
                  read: isRead,
                  linkTo: `/admin/complaints/${complaint.id_pelaporan}`,
                  soundPlayed: isRead,
                };
                
                if (!isRead && soundEnabled && !playedSoundsRef.current.has(notifId)) {
                  playedSoundsRef.current.add(notifId);
                  hasNewNotification = true;
                }
                
                return [newNotif, ...prev.slice(0, 19)];
              }
              return prev;
            });
          });

          // Check for complaints with feedback
          const complaintsWithFeedback = complaints.filter(c => 
            c.aspirasi?.some(a => a.feedback && a.feedback > 0)
          );

          complaintsWithFeedback.slice(0, 3).forEach(complaint => {
            const aspirasi = complaint.aspirasi?.find(a => a.feedback && a.feedback > 0);
            if (aspirasi) {
              const notifId = `feedback-${complaint.id_pelaporan}-${aspirasi.feedback}`;
              
              // Skip dismissed notifications
              if (dismissedIdsRef.current.has(notifId)) return;
              
              setNotifications(prev => {
                const exists = prev.some(n => n.id === notifId);
                
                if (!exists) {
                  const isRead = readIdsRef.current.has(notifId);
                  const newNotif: Notification = {
                    id: notifId,
                    type: 'response',
                    title: 'Rating Baru',
                    message: `${complaint.siswa?.nama || 'Siswa'} memberikan rating ${aspirasi.feedback} ⭐`,
                    timestamp: new Date(),
                    read: isRead,
                    linkTo: `/admin/complaints/${complaint.id_pelaporan}`,
                    soundPlayed: isRead,
                  };
                  
                  if (!isRead && soundEnabled && !playedSoundsRef.current.has(notifId)) {
                    playedSoundsRef.current.add(notifId);
                    hasNewNotification = true;
                  }
                  
                  return [newNotif, ...prev.slice(0, 19)];
                }
                return prev;
              });
            }
          });
        }
      }

      if (hasNewNotification) {
        playNotificationSound();
      }

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to check notifications:', error);
    }
  }, [role, siswa, admin, soundEnabled]);

  const refreshNow = useCallback(() => {
    checkNotifications();
  }, [checkNotifications]);

  // Poll for notifications every 60 seconds
  useEffect(() => {
    if (!role) return;
    
    const timer = setTimeout(() => {
      checkNotifications();
    }, 5000);

    const interval = setInterval(() => {
      checkNotifications();
    }, 60000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [role, checkNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        soundEnabled,
        toggleSound,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        lastRefresh,
        refreshNow,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
