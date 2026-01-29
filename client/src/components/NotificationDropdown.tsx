import { useState, useEffect } from "react";
import { Bell, Check, Info, AlertTriangle, CheckCircle } from "lucide-react";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "INFO" | "WARNING" | "SUCCESS";
    isRead: boolean;
    createdAt: string;
}

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationDropdown = ({ isOpen, onClose }: NotificationDropdownProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/notifications", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setNotifications(data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const markAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const markAllRead = async () => {
        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:5000/api/notifications/read-all`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getIcon = (type: string) => {
        switch (type) {
            case "WARNING": return <AlertTriangle className="text-yellow-500" size={18} />;
            case "SUCCESS": return <CheckCircle className="text-green-500" size={18} />;
            default: return <Info className="text-blue-500" size={18} />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                        Mark all read
                    </button>
                )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        Loading...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Bell className="mx-auto mb-3 text-gray-300" size={32} />
                        <p className="text-sm">No notifications yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!notification.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                            >
                                <div className="mt-1 flex-shrink-0">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm font-semibold truncate pr-2 ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {notification.title}
                                        </h4>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                                        {notification.message}
                                    </p>
                                    {!notification.isRead && (
                                        <button
                                            onClick={(e) => markAsRead(notification.id, e)}
                                            className="mt-2 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium flex items-center gap-1"
                                        >
                                            <Check size={12} /> Mark read
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
                <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    Close
                </button>
            </div>
        </div>
    );
};

export default NotificationDropdown;
