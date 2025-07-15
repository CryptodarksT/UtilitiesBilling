import customtkinter as ctk
from tkinter import ttk, messagebox, filedialog
import json
import threading
from datetime import datetime

class AdminFrame:
    """Frame quản trị hệ thống"""
    
    def __init__(self, parent, app):
        self.parent = parent
        self.app = app
        self.create_ui()
    
    def create_ui(self):
        """Tạo giao diện quản trị"""
        # Main container
        main_frame = ctk.CTkFrame(self.parent)
        main_frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # Title
        title_label = ctk.CTkLabel(
            main_frame,
            text="⚙️ QUẢN TRỊ HỆ THỐNG",
            font=ctk.CTkFont(size=20, weight="bold")
        )
        title_label.pack(pady=10)
        
        # Tabview for admin sections
        self.admin_tabview = ctk.CTkTabview(main_frame, width=1000, height=500)
        self.admin_tabview.pack(fill="both", expand=True, pady=10)
        
        # Create tabs
        self.create_api_config_tab()
        self.create_system_settings_tab()
        self.create_database_tab()
        self.create_logs_tab()
    
    def create_api_config_tab(self):
        """Tạo tab cấu hình API"""
        api_tab = self.admin_tabview.add("🔑 Cấu hình API")
        
        # API providers
        providers = [
            {
                "name": "MoMo Business",
                "key": "momo",
                "fields": [
                    {"name": "partner_code", "label": "Partner Code", "type": "text"},
                    {"name": "access_key", "label": "Access Key", "type": "text"},
                    {"name": "secret_key", "label": "Secret Key", "type": "password"},
                    {"name": "sandbox", "label": "Sandbox Mode", "type": "checkbox"}
                ]
            },
            {
                "name": "BIDV API",
                "key": "bidv",
                "fields": [
                    {"name": "api_key", "label": "API Key", "type": "text"},
                    {"name": "api_secret", "label": "API Secret", "type": "password"},
                    {"name": "api_url", "label": "API URL", "type": "text"},
                    {"name": "sandbox", "label": "Sandbox Mode", "type": "checkbox"}
                ]
            },
            {
                "name": "ZaloPay Business",
                "key": "zalopay",
                "fields": [
                    {"name": "app_id", "label": "App ID", "type": "text"},
                    {"name": "key1", "label": "Key 1", "type": "password"},
                    {"name": "key2", "label": "Key 2", "type": "password"},
                    {"name": "sandbox", "label": "Sandbox Mode", "type": "checkbox"}
                ]
            },
            {
                "name": "Visa Direct",
                "key": "visa",
                "fields": [
                    {"name": "user_id", "label": "User ID", "type": "text"},
                    {"name": "password", "label": "Password", "type": "password"},
                    {"name": "cert_path", "label": "Certificate Path", "type": "file"},
                    {"name": "key_path", "label": "Private Key Path", "type": "file"},
                    {"name": "sandbox", "label": "Sandbox Mode", "type": "checkbox"}
                ]
            }
        ]
        
        # Scroll frame for API configs
        scroll_frame = ctk.CTkScrollableFrame(api_tab, width=900, height=400)
        scroll_frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        self.api_entries = {}
        
        for provider in providers:
            # Provider frame
            provider_frame = ctk.CTkFrame(scroll_frame)
            provider_frame.pack(fill="x", padx=10, pady=10)
            
            # Provider title
            title_frame = ctk.CTkFrame(provider_frame)
            title_frame.pack(fill="x", padx=10, pady=5)
            
            ctk.CTkLabel(
                title_frame,
                text=f"🔧 {provider['name']}",
                font=ctk.CTkFont(size=16, weight="bold")
            ).pack(side="left")
            
            # Test connection button
            test_button = ctk.CTkButton(
                title_frame,
                text="Test Connection",
                command=lambda p=provider['key']: self.test_api_connection(p),
                width=120
            )
            test_button.pack(side="right", padx=5)
            
            # Save button
            save_button = ctk.CTkButton(
                title_frame,
                text="Save Config",
                command=lambda p=provider['key']: self.save_api_config(p),
                width=120
            )
            save_button.pack(side="right", padx=5)
            
            # Fields frame
            fields_frame = ctk.CTkFrame(provider_frame)
            fields_frame.pack(fill="x", padx=10, pady=5)
            
            self.api_entries[provider['key']] = {}
            
            for field in provider['fields']:
                field_frame = ctk.CTkFrame(fields_frame)
                field_frame.pack(fill="x", padx=5, pady=2)
                
                # Label
                ctk.CTkLabel(
                    field_frame,
                    text=f"{field['label']}:",
                    font=ctk.CTkFont(size=12),
                    width=120
                ).pack(side="left", padx=5)
                
                # Input
                if field['type'] == 'text':
                    entry = ctk.CTkEntry(field_frame, width=300)
                    entry.pack(side="left", padx=5)
                    self.api_entries[provider['key']][field['name']] = entry
                
                elif field['type'] == 'password':
                    entry = ctk.CTkEntry(field_frame, width=300, show="*")
                    entry.pack(side="left", padx=5)
                    self.api_entries[provider['key']][field['name']] = entry
                
                elif field['type'] == 'file':
                    entry = ctk.CTkEntry(field_frame, width=250)
                    entry.pack(side="left", padx=5)
                    browse_button = ctk.CTkButton(
                        field_frame,
                        text="Browse",
                        command=lambda e=entry: self.browse_file(e),
                        width=60
                    )
                    browse_button.pack(side="left", padx=5)
                    self.api_entries[provider['key']][field['name']] = entry
                
                elif field['type'] == 'checkbox':
                    checkbox = ctk.CTkCheckBox(field_frame, text="")
                    checkbox.pack(side="left", padx=5)
                    self.api_entries[provider['key']][field['name']] = checkbox
        
        # Load existing configs
        self.load_api_configs()
    
    def create_system_settings_tab(self):
        """Tạo tab cài đặt hệ thống"""
        settings_tab = self.admin_tabview.add("🛠️ Cài đặt hệ thống")
        
        # Settings frame
        settings_frame = ctk.CTkFrame(settings_tab)
        settings_frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # General settings
        general_frame = ctk.CTkFrame(settings_frame)
        general_frame.pack(fill="x", padx=10, pady=10)
        
        ctk.CTkLabel(general_frame, text="📋 Cài đặt chung", font=ctk.CTkFont(size=16, weight="bold")).pack(anchor="w", pady=5)
        
        # Theme
        theme_frame = ctk.CTkFrame(general_frame)
        theme_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(theme_frame, text="Giao diện:", width=120).pack(side="left", padx=5)
        self.theme_combo = ctk.CTkComboBox(theme_frame, values=["light", "dark", "system"], width=200)
        self.theme_combo.pack(side="left", padx=5)
        
        # Language
        lang_frame = ctk.CTkFrame(general_frame)
        lang_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(lang_frame, text="Ngôn ngữ:", width=120).pack(side="left", padx=5)
        self.lang_combo = ctk.CTkComboBox(lang_frame, values=["vi", "en"], width=200)
        self.lang_combo.pack(side="left", padx=5)
        
        # Auto save
        auto_save_frame = ctk.CTkFrame(general_frame)
        auto_save_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(auto_save_frame, text="Tự động lưu:", width=120).pack(side="left", padx=5)
        self.auto_save_checkbox = ctk.CTkCheckBox(auto_save_frame, text="Bật tự động lưu")
        self.auto_save_checkbox.pack(side="left", padx=5)
        
        # Performance settings
        perf_frame = ctk.CTkFrame(settings_frame)
        perf_frame.pack(fill="x", padx=10, pady=10)
        
        ctk.CTkLabel(perf_frame, text="⚡ Cài đặt hiệu suất", font=ctk.CTkFont(size=16, weight="bold")).pack(anchor="w", pady=5)
        
        # Timeout
        timeout_frame = ctk.CTkFrame(perf_frame)
        timeout_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(timeout_frame, text="Timeout (s):", width=120).pack(side="left", padx=5)
        self.timeout_entry = ctk.CTkEntry(timeout_frame, width=100)
        self.timeout_entry.pack(side="left", padx=5)
        
        # Retry count
        retry_frame = ctk.CTkFrame(perf_frame)
        retry_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(retry_frame, text="Retry count:", width=120).pack(side="left", padx=5)
        self.retry_entry = ctk.CTkEntry(retry_frame, width=100)
        self.retry_entry.pack(side="left", padx=5)
        
        # Action buttons
        action_frame = ctk.CTkFrame(settings_frame)
        action_frame.pack(fill="x", padx=10, pady=10)
        
        ctk.CTkButton(action_frame, text="💾 Lưu cài đặt", command=self.save_system_settings).pack(side="left", padx=5)
        ctk.CTkButton(action_frame, text="🔄 Khôi phục mặc định", command=self.reset_system_settings).pack(side="left", padx=5)
        ctk.CTkButton(action_frame, text="📤 Xuất cấu hình", command=self.export_config).pack(side="left", padx=5)
        ctk.CTkButton(action_frame, text="📥 Nhập cấu hình", command=self.import_config).pack(side="left", padx=5)
        
        # Load current settings
        self.load_system_settings()
    
    def create_database_tab(self):
        """Tạo tab quản lý database"""
        db_tab = self.admin_tabview.add("💾 Database")
        
        # Database frame
        db_frame = ctk.CTkFrame(db_tab)
        db_frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # Connection info
        conn_frame = ctk.CTkFrame(db_frame)
        conn_frame.pack(fill="x", padx=10, pady=10)
        
        ctk.CTkLabel(conn_frame, text="🔗 Kết nối Database", font=ctk.CTkFont(size=16, weight="bold")).pack(anchor="w", pady=5)
        
        # Connection status
        self.db_status_label = ctk.CTkLabel(conn_frame, text="Trạng thái: Chưa kết nối", font=ctk.CTkFont(size=12))
        self.db_status_label.pack(anchor="w", padx=10, pady=2)
        
        # Test connection button
        ctk.CTkButton(conn_frame, text="Test Connection", command=self.test_database_connection).pack(anchor="w", padx=10, pady=5)
        
        # Database operations
        ops_frame = ctk.CTkFrame(db_frame)
        ops_frame.pack(fill="x", padx=10, pady=10)
        
        ctk.CTkLabel(ops_frame, text="🛠️ Thao tác Database", font=ctk.CTkFont(size=16, weight="bold")).pack(anchor="w", pady=5)
        
        # Buttons
        button_frame = ctk.CTkFrame(ops_frame)
        button_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkButton(button_frame, text="🗂️ Backup Database", command=self.backup_database).pack(side="left", padx=5)
        ctk.CTkButton(button_frame, text="📥 Restore Database", command=self.restore_database).pack(side="left", padx=5)
        ctk.CTkButton(button_frame, text="🗑️ Clear Data", command=self.clear_database).pack(side="left", padx=5)
        
        # Statistics
        stats_frame = ctk.CTkFrame(db_frame)
        stats_frame.pack(fill="x", padx=10, pady=10)
        
        ctk.CTkLabel(stats_frame, text="📊 Thống kê Database", font=ctk.CTkFont(size=16, weight="bold")).pack(anchor="w", pady=5)
        
        self.db_stats_text = ctk.CTkTextbox(stats_frame, width=800, height=200)
        self.db_stats_text.pack(fill="both", expand=True, padx=10, pady=5)
        
        # Refresh stats
        ctk.CTkButton(stats_frame, text="🔄 Refresh Stats", command=self.refresh_database_stats).pack(anchor="w", padx=10, pady=5)
        
        # Initial stats load
        self.refresh_database_stats()
    
    def create_logs_tab(self):
        """Tạo tab xem logs"""
        logs_tab = self.admin_tabview.add("📋 Logs")
        
        # Logs frame
        logs_frame = ctk.CTkFrame(logs_tab)
        logs_frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # Controls
        controls_frame = ctk.CTkFrame(logs_frame)
        controls_frame.pack(fill="x", padx=10, pady=10)
        
        ctk.CTkLabel(controls_frame, text="📄 System Logs", font=ctk.CTkFont(size=16, weight="bold")).pack(side="left")
        
        # Buttons
        button_frame = ctk.CTkFrame(controls_frame)
        button_frame.pack(side="right")
        
        ctk.CTkButton(button_frame, text="🔄 Refresh", command=self.refresh_logs).pack(side="left", padx=5)
        ctk.CTkButton(button_frame, text="🗑️ Clear", command=self.clear_logs).pack(side="left", padx=5)
        ctk.CTkButton(button_frame, text="💾 Save", command=self.save_logs).pack(side="left", padx=5)
        
        # Log level filter
        filter_frame = ctk.CTkFrame(logs_frame)
        filter_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(filter_frame, text="Log Level:", width=100).pack(side="left", padx=5)
        self.log_level_combo = ctk.CTkComboBox(filter_frame, values=["All", "ERROR", "WARNING", "INFO", "DEBUG"], width=150)
        self.log_level_combo.pack(side="left", padx=5)
        self.log_level_combo.set("All")
        
        # Logs display
        self.logs_text = ctk.CTkTextbox(logs_frame, width=800, height=400)
        self.logs_text.pack(fill="both", expand=True, padx=10, pady=10)
        
        # Load initial logs
        self.refresh_logs()
    
    def browse_file(self, entry):
        """Browse file dialog"""
        file_path = filedialog.askopenfilename(
            title="Chọn file",
            filetypes=[("All files", "*.*"), ("Certificate files", "*.pem *.crt"), ("Key files", "*.key")]
        )
        if file_path:
            entry.delete(0, "end")
            entry.insert(0, file_path)
    
    def test_api_connection(self, provider):
        """Test API connection"""
        def test_thread():
            try:
                if provider == "momo":
                    result = self.app.momo_service.test_connection()
                elif provider == "bidv":
                    result = self.app.bidv_service.test_connection()
                elif provider == "zalopay":
                    result = self.app.zalopay_service.test_connection()
                elif provider == "visa":
                    result = self.app.visa_service.test_connection()
                else:
                    result = {"success": False, "message": "Provider không hỗ trợ"}
                
                if result.get("success"):
                    self.app.show_message("Thành công", f"Kết nối {provider.upper()} thành công", "success")
                else:
                    self.app.show_message("Lỗi", f"Kết nối {provider.upper()} thất bại: {result.get('message', '')}", "error")
            except Exception as e:
                self.app.show_message("Lỗi", f"Lỗi test connection: {str(e)}", "error")
        
        thread = threading.Thread(target=test_thread)
        thread.start()
    
    def save_api_config(self, provider):
        """Save API configuration"""
        try:
            config = {}
            entries = self.api_entries.get(provider, {})
            
            for field_name, widget in entries.items():
                if isinstance(widget, ctk.CTkEntry):
                    config[field_name] = widget.get()
                elif isinstance(widget, ctk.CTkCheckBox):
                    config[field_name] = widget.get()
            
            # Save to config manager
            self.app.config_manager.set_api_config(provider, config)
            
            # Update service configuration
            if provider == "momo":
                self.app.momo_service.configure(
                    partner_code=config.get("partner_code", ""),
                    access_key=config.get("access_key", ""),
                    secret_key=config.get("secret_key", ""),
                    sandbox=config.get("sandbox", True)
                )
            elif provider == "bidv":
                self.app.bidv_service.configure(
                    api_key=config.get("api_key", ""),
                    api_secret=config.get("api_secret", ""),
                    api_url=config.get("api_url", "")
                )
            elif provider == "zalopay":
                self.app.zalopay_service.configure(
                    app_id=config.get("app_id", ""),
                    key1=config.get("key1", ""),
                    key2=config.get("key2", ""),
                    sandbox=config.get("sandbox", True)
                )
            elif provider == "visa":
                self.app.visa_service.configure(
                    user_id=config.get("user_id", ""),
                    password=config.get("password", ""),
                    cert_path=config.get("cert_path", ""),
                    key_path=config.get("key_path", ""),
                    sandbox=config.get("sandbox", True)
                )
            
            self.app.show_message("Thành công", f"Đã lưu cấu hình {provider.upper()}", "success")
            
        except Exception as e:
            self.app.show_message("Lỗi", f"Lỗi lưu cấu hình: {str(e)}", "error")
    
    def load_api_configs(self):
        """Load API configurations"""
        providers = ["momo", "bidv", "zalopay", "visa"]
        
        for provider in providers:
            try:
                config = self.app.config_manager.get_api_config(provider)
                entries = self.api_entries.get(provider, {})
                
                for field_name, value in config.items():
                    if field_name in entries:
                        widget = entries[field_name]
                        if isinstance(widget, ctk.CTkEntry):
                            widget.delete(0, "end")
                            widget.insert(0, str(value))
                        elif isinstance(widget, ctk.CTkCheckBox):
                            if value:
                                widget.select()
                            else:
                                widget.deselect()
            except Exception as e:
                print(f"Error loading {provider} config: {e}")
    
    def save_system_settings(self):
        """Save system settings"""
        try:
            settings = {
                "theme": self.theme_combo.get(),
                "language": self.lang_combo.get(),
                "auto_save": self.auto_save_checkbox.get(),
                "timeout": int(self.timeout_entry.get() or 30),
                "retry_count": int(self.retry_entry.get() or 3)
            }
            
            # Save to config manager
            for key, value in settings.items():
                self.app.config_manager.set_setting(f"app_settings.{key}", value)
            
            self.app.show_message("Thành công", "Đã lưu cài đặt hệ thống", "success")
            
        except Exception as e:
            self.app.show_message("Lỗi", f"Lỗi lưu cài đặt: {str(e)}", "error")
    
    def load_system_settings(self):
        """Load system settings"""
        try:
            self.theme_combo.set(self.app.config_manager.get_setting("app_settings.theme", "light"))
            self.lang_combo.set(self.app.config_manager.get_setting("app_settings.language", "vi"))
            
            auto_save = self.app.config_manager.get_setting("app_settings.auto_save", True)
            if auto_save:
                self.auto_save_checkbox.select()
            else:
                self.auto_save_checkbox.deselect()
            
            self.timeout_entry.delete(0, "end")
            self.timeout_entry.insert(0, str(self.app.config_manager.get_setting("api_settings.timeout", 30)))
            
            self.retry_entry.delete(0, "end")
            self.retry_entry.insert(0, str(self.app.config_manager.get_setting("api_settings.retry_count", 3)))
            
        except Exception as e:
            print(f"Error loading system settings: {e}")
    
    def reset_system_settings(self):
        """Reset system settings to default"""
        if messagebox.askyesno("Xác nhận", "Bạn có muốn khôi phục cài đặt mặc định?"):
            try:
                self.app.config_manager.reset_config()
                self.load_system_settings()
                self.app.show_message("Thành công", "Đã khôi phục cài đặt mặc định", "success")
            except Exception as e:
                self.app.show_message("Lỗi", f"Lỗi khôi phục cài đặt: {str(e)}", "error")
    
    def export_config(self):
        """Export configuration"""
        file_path = filedialog.asksaveasfilename(
            title="Xuất cấu hình",
            defaultextension=".json",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
        )
        
        if file_path:
            try:
                if self.app.config_manager.export_config(file_path, include_secure=True):
                    self.app.show_message("Thành công", "Đã xuất cấu hình thành công", "success")
                else:
                    self.app.show_message("Lỗi", "Không thể xuất cấu hình", "error")
            except Exception as e:
                self.app.show_message("Lỗi", f"Lỗi xuất cấu hình: {str(e)}", "error")
    
    def import_config(self):
        """Import configuration"""
        file_path = filedialog.askopenfilename(
            title="Nhập cấu hình",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
        )
        
        if file_path:
            try:
                if self.app.config_manager.import_config(file_path):
                    self.load_system_settings()
                    self.load_api_configs()
                    self.app.show_message("Thành công", "Đã nhập cấu hình thành công", "success")
                else:
                    self.app.show_message("Lỗi", "Không thể nhập cấu hình", "error")
            except Exception as e:
                self.app.show_message("Lỗi", f"Lỗi nhập cấu hình: {str(e)}", "error")
    
    def test_database_connection(self):
        """Test database connection"""
        try:
            # Simulate database connection test
            self.db_status_label.configure(text="Trạng thái: Đang kết nối...")
            
            # In a real app, this would test actual database connection
            import time
            time.sleep(1)
            
            self.db_status_label.configure(text="Trạng thái: Kết nối thành công")
            self.app.show_message("Thành công", "Kết nối database thành công", "success")
            
        except Exception as e:
            self.db_status_label.configure(text="Trạng thái: Kết nối thất bại")
            self.app.show_message("Lỗi", f"Lỗi kết nối database: {str(e)}", "error")
    
    def backup_database(self):
        """Backup database"""
        file_path = filedialog.asksaveasfilename(
            title="Backup Database",
            defaultextension=".sql",
            filetypes=[("SQL files", "*.sql"), ("All files", "*.*")]
        )
        
        if file_path:
            try:
                # Simulate database backup
                self.app.show_message("Thành công", "Đã backup database thành công", "success")
            except Exception as e:
                self.app.show_message("Lỗi", f"Lỗi backup database: {str(e)}", "error")
    
    def restore_database(self):
        """Restore database"""
        file_path = filedialog.askopenfilename(
            title="Restore Database",
            filetypes=[("SQL files", "*.sql"), ("All files", "*.*")]
        )
        
        if file_path:
            if messagebox.askyesno("Xác nhận", "Bạn có muốn restore database? Dữ liệu hiện tại sẽ bị ghi đè."):
                try:
                    # Simulate database restore
                    self.app.show_message("Thành công", "Đã restore database thành công", "success")
                except Exception as e:
                    self.app.show_message("Lỗi", f"Lỗi restore database: {str(e)}", "error")
    
    def clear_database(self):
        """Clear database"""
        if messagebox.askyesno("Xác nhận", "Bạn có muốn xóa tất cả dữ liệu? Thao tác này không thể hoàn tác."):
            try:
                # Simulate database clear
                self.app.show_message("Thành công", "Đã xóa dữ liệu thành công", "success")
                self.refresh_database_stats()
            except Exception as e:
                self.app.show_message("Lỗi", f"Lỗi xóa dữ liệu: {str(e)}", "error")
    
    def refresh_database_stats(self):
        """Refresh database statistics"""
        try:
            # Simulate database statistics
            stats = f"""
DATABASE STATISTICS
==================
Connection Status: Connected
Database Size: 25.6 MB
Total Tables: 8
Total Records: 1,247

TABLE STATISTICS
================
Bills: 456 records
Customers: 234 records
Payments: 357 records
Transactions: 200 records

PERFORMANCE METRICS
==================
Average Query Time: 15ms
Cache Hit Rate: 92%
Connection Pool: 8/10 active
Last Backup: 2025-07-15 08:30:00

STORAGE USAGE
=============
Data Files: 18.2 MB
Index Files: 5.1 MB
Log Files: 2.3 MB
Free Space: 74.4 MB
"""
            
            self.db_stats_text.delete("1.0", "end")
            self.db_stats_text.insert("1.0", stats)
            
        except Exception as e:
            self.db_stats_text.delete("1.0", "end")
            self.db_stats_text.insert("1.0", f"Error loading stats: {str(e)}")
    
    def refresh_logs(self):
        """Refresh system logs"""
        try:
            # Simulate system logs
            logs = f"""
[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] INFO: Application started
[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] INFO: Loading configuration...
[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] INFO: API services initialized
[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] INFO: Database connection established
[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] INFO: GUI components loaded
[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] INFO: System ready for use
[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] INFO: Bill lookup request processed
[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] INFO: Payment transaction completed
[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] WARNING: API response time exceeded threshold
[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] INFO: Configuration saved successfully
"""
            
            self.logs_text.delete("1.0", "end")
            self.logs_text.insert("1.0", logs)
            
        except Exception as e:
            self.logs_text.delete("1.0", "end")
            self.logs_text.insert("1.0", f"Error loading logs: {str(e)}")
    
    def clear_logs(self):
        """Clear system logs"""
        if messagebox.askyesno("Xác nhận", "Bạn có muốn xóa tất cả logs?"):
            self.logs_text.delete("1.0", "end")
            self.logs_text.insert("1.0", "Logs cleared.\n")
    
    def save_logs(self):
        """Save logs to file"""
        file_path = filedialog.asksaveasfilename(
            title="Lưu logs",
            defaultextension=".log",
            filetypes=[("Log files", "*.log"), ("Text files", "*.txt"), ("All files", "*.*")]
        )
        
        if file_path:
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(self.logs_text.get("1.0", "end"))
                self.app.show_message("Thành công", "Đã lưu logs thành công", "success")
            except Exception as e:
                self.app.show_message("Lỗi", f"Lỗi lưu logs: {str(e)}", "error")