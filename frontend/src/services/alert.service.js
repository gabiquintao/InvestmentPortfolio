// ============================================================================
// Alert Service
// Handles alert CRUD operations and monitoring
// ============================================================================
import api from "./api";
const ALERT_ENDPOINTS = {
    BASE: "/alert",
    BY_ID: (id) => `/alert/${id}`,
    TRIGGER: (id) => `/alert/${id}/trigger`,
};
// ============================================================================
// ALERT SERVICE
// ============================================================================
class AlertService {
    /**
     * Get all alerts for the authenticated user
     */
    async getUserAlerts() {
        const response = await api.get(ALERT_ENDPOINTS.BASE);
        return response.data;
    }
    /**
     * Get a specific alert by ID
     */
    async getById(id) {
        const response = await api.get(ALERT_ENDPOINTS.BY_ID(id));
        return response.data;
    }
    /**
     * Create a new alert
     */
    async create(data) {
        const response = await api.post(ALERT_ENDPOINTS.BASE, data);
        return response.data;
    }
    /**
     * Update an existing alert
     */
    async update(id, data) {
        const response = await api.put(ALERT_ENDPOINTS.BY_ID(id), data);
        return response.data;
    }
    /**
     * Delete an alert
     */
    async delete(id) {
        await api.delete(ALERT_ENDPOINTS.BY_ID(id));
    }
    /**
     * Manually trigger an alert check
     */
    async triggerCheck(id) {
        await api.post(ALERT_ENDPOINTS.TRIGGER(id));
    }
    /**
     * Get active alerts only
     */
    async getActiveAlerts() {
        const alerts = await this.getUserAlerts();
        return alerts.filter((alert) => alert.isActive);
    }
    /**
     * Get inactive alerts
     */
    async getInactiveAlerts() {
        const alerts = await this.getUserAlerts();
        return alerts.filter((alert) => !alert.isActive);
    }
    /**
     * Get triggered alerts
     */
    async getTriggeredAlerts() {
        const alerts = await this.getUserAlerts();
        return alerts.filter((alert) => alert.triggeredAt != null);
    }
    /**
     * Get untriggered alerts
     */
    async getUntriggeredAlerts() {
        const alerts = await this.getUserAlerts();
        return alerts.filter((alert) => alert.triggeredAt == null);
    }
    /**
     * Get alerts for a specific asset symbol
     */
    async getAlertsBySymbol(symbol) {
        const alerts = await this.getUserAlerts();
        return alerts.filter((alert) => alert.assetSymbol.toLowerCase() === symbol.toLowerCase());
    }
    /**
     * Get alerts by condition type
     */
    async getAlertsByCondition(condition) {
        const alerts = await this.getUserAlerts();
        return alerts.filter((alert) => alert.condition === condition);
    }
    /**
     * Get alert statistics
     */
    async getAlertStats() {
        const alerts = await this.getUserAlerts();
        return {
            total: alerts.length,
            active: alerts.filter((a) => a.isActive).length,
            inactive: alerts.filter((a) => !a.isActive).length,
            triggered: alerts.filter((a) => a.triggeredAt != null).length,
            untriggered: alerts.filter((a) => a.triggeredAt == null).length,
        };
    }
    /**
     * Get recent alerts (last N alerts)
     */
    async getRecentAlerts(limit = 10) {
        const alerts = await this.getUserAlerts();
        return alerts
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, limit);
    }
    /**
     * Get recently triggered alerts
     */
    async getRecentlyTriggered(limit = 10) {
        const alerts = await this.getTriggeredAlerts();
        return alerts
            .sort((a, b) => {
            const dateA = a.triggeredAt ? new Date(a.triggeredAt).getTime() : 0;
            const dateB = b.triggeredAt ? new Date(b.triggeredAt).getTime() : 0;
            return dateB - dateA;
        })
            .slice(0, limit);
    }
}
// Export singleton instance
export default new AlertService();
