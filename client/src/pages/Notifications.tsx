import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Bell, Check, Info, AlertTriangle, CheckCircle } from "lucide-react";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "INFO" | "WARNING" | "SUCCESS";
    isRead: boolean;
    createdAt: string;
}

const Notifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
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
        fetchNotifications();
    }, []);

    const markAsRead = async (id: string) => {
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

    const getIcon = (type: string) => {
        switch (type) {
            case "WARNING": return <AlertTriangle className="text-yellow-500" size={24} />;
            case "SUCCESS": return <CheckCircle className="text-green-500" size={24} />;
            default: return <Info className="text-blue-500" size={24} />;
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-300">
                            <Bell size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                            <p className="text-gray-500 dark:text-gray-400">Stay updated with your expenses and account</p>
                        </div>
                    </div>
                    <button
                        onClick={markAllRead}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    >
                        <Check size={16} /> Mark all read
                    </button>
                </div>

                {/* List */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            <Bell className="mx-auto mb-3 text-gray-300" size={48} />
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                                    className={`p-6 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                                >
                                    <div className="mt-1 flex-shrink-0">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`text-base font-semibold ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                {notification.title}
                                                {!notification.isRead && <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>}
                                            </h3>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {notification.message}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Notifications;
