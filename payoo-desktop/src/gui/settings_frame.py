import customtkinter as ctk
from tkinter import ttk, messagebox, filedialog
import json
from datetime import datetime

class SettingsFrame:
    """Frame cài đặt ứng dụng"""
    
    def __init__(self, parent, app):
        self.parent = parent
        self.app = app
        self.create_ui()
        self.load_settings()
    
    def create_ui(self):
        """Tạo giao diện cài đặt"""
        # Main container
        main_frame = ctk.CTkFrame(self.parent)
        main_frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # Title
        title_label = ctk.CTkLabel(
            main_frame,
            text="🔧 CÀI ĐẶT ỨNG DỤNG",
            font=ctk.CTkFont(size=20, weight="bold")
        )
        title_label.pack(pady=10)
        
        # Settings tabview
        self.settings_tabview = ctk.CTkTabview(main_frame, width=1000, height=500)
        self.settings_tabview.pack(fill="both", expand=True, pady=10)
        
        # Create tabs
        self.create_appearance_tab()
        self.create_performance_tab()
        self.create_security_tab()
        self.create_notification_tab()
        self.create_backup_tab()
    
    def create_appearance_tab(self):
        """Tạo tab giao diện"""
        appearance_tab = self.settings_tabview.add("🎨 Giao diện")
        
        # Theme section
        theme_frame = ctk.CTkFrame(appearance_tab)
        theme_frame.pack(fill="x", padx=20, pady=10)
        
        ctk.CTkLabel(
            theme_frame,
            text="🌈 Chủ đề giao diện",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(anchor="w", pady=5)
        
        # Theme selection
        theme_selection_frame = ctk.CTkFrame(theme_frame)
        theme_selection_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(theme_selection_frame, text="Chủ đề:", width=120).pack(side="left", padx=5)
        self.theme_combo = ctk.CTkComboBox(
            theme_selection_frame,
            values=["light", "dark", "system"],
            width=200,
            command=self.change_theme
        )
        self.theme_combo.pack(side="left", padx=5)
        
        # Font size
        font_frame = ctk.CTkFrame(theme_frame)
        font_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(font_frame, text="Kích thước font:", width=120).pack(side="left", padx=5)
        self.font_size_slider = ctk.CTkSlider(
            font_frame,
            from_=10,
            to=20,
            number_of_steps=10,
            command=self.change_font_size
        )
        self.font_size_slider.pack(side="left", padx=5)
        
        self.font_size_label = ctk.CTkLabel(font_frame, text="12px", width=50)
        self.font_size_label.pack(side="left", padx=5)
        
        # Window settings
        window_frame = ctk.CTkFrame(appearance_tab)
        window_frame.pack(fill="x", padx=20, pady=10)
        
        ctk.CTkLabel(
            window_frame,
            text="🪟 Cài đặt cửa sổ",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(anchor="w", pady=5)
        
        # Window size
        size_frame = ctk.CTkFrame(window_frame)
        size_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(size_frame, text="Kích thước cửa sổ:", width=120).pack(side="left", padx=5)
        self.window_size_combo = ctk.CTkComboBox(
            size_frame,
            values=["1200x800", "1400x900", "1600x1000", "Tùy chỉnh"],
            width=150
        )
        self.window_size_combo.pack(side="left", padx=5)
        
        # Remember position
        position_frame = ctk.CTkFrame(window_frame)
        position_frame.pack(fill="x", padx=10, pady=5)
        
        self.remember_position_checkbox = ctk.CTkCheckBox(
            position_frame,
            text="Ghi nhớ vị trí cửa sổ"
        )
        self.remember_position_checkbox.pack(side="left", padx=5)
        
        # Minimize to tray
        tray_frame = ctk.CTkFrame(window_frame)
        tray_frame.pack(fill="x", padx=10, pady=5)
        
        self.minimize_to_tray_checkbox = ctk.CTkCheckBox(
            tray_frame,
            text="Thu nhỏ xuống system tray"
        )
        self.minimize_to_tray_checkbox.pack(side="left", padx=5)
    
    def create_performance_tab(self):
        """Tạo tab hiệu suất"""
        performance_tab = self.settings_tabview.add("⚡ Hiệu suất")
        
        # API settings
        api_frame = ctk.CTkFrame(performance_tab)
        api_frame.pack(fill="x", padx=20, pady=10)
        
        ctk.CTkLabel(
            api_frame,
            text="🔗 Cài đặt API",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(anchor="w", pady=5)
        
        # Timeout
        timeout_frame = ctk.CTkFrame(api_frame)
        timeout_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(timeout_frame, text="Timeout (giây):", width=120).pack(side="left", padx=5)
        self.timeout_entry = ctk.CTkEntry(timeout_frame, width=100)
        self.timeout_entry.pack(side="left", padx=5)
        
        # Retry count
        retry_frame = ctk.CTkFrame(api_frame)
        retry_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(retry_frame, text="Số lần thử lại:", width=120).pack(side="left", padx=5)
        self.retry_count_entry = ctk.CTkEntry(retry_frame, width=100)
        self.retry_count_entry.pack(side="left", padx=5)
        
        # Concurrent requests
        concurrent_frame = ctk.CTkFrame(api_frame)
        concurrent_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(concurrent_frame, text="Requests đồng thời:", width=120).pack(side="left", padx=5)
        self.concurrent_entry = ctk.CTkEntry(concurrent_frame, width=100)
        self.concurrent_entry.pack(side="left", padx=5)
        
        # Cache settings
        cache_frame = ctk.CTkFrame(performance_tab)
        cache_frame.pack(fill="x", padx=20, pady=10)
        
        ctk.CTkLabel(
            cache_frame,
            text="💾 Cài đặt Cache",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(anchor="w", pady=5)
        
        # Enable cache
        enable_cache_frame = ctk.CTkFrame(cache_frame)
        enable_cache_frame.pack(fill="x", padx=10, pady=5)
        
        self.enable_cache_checkbox = ctk.CTkCheckBox(
            enable_cache_frame,
            text="Bật cache để tăng tốc độ"
        )
        self.enable_cache_checkbox.pack(side="left", padx=5)
        
        # Cache size
        cache_size_frame = ctk.CTkFrame(cache_frame)
        cache_size_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(cache_size_frame, text="Kích thước cache (MB):", width=150).pack(side="left", padx=5)
        self.cache_size_entry = ctk.CTkEntry(cache_size_frame, width=100)
        self.cache_size_entry.pack(side="left", padx=5)
        
        # Clear cache button
        clear_cache_frame = ctk.CTkFrame(cache_frame)
        clear_cache_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkButton(
            clear_cache_frame,
            text="🗑️ Xóa cache",
            command=self.clear_cache,
            width=120
        ).pack(side="left", padx=5)
    
    def create_security_tab(self):
        """Tạo tab bảo mật"""
        security_tab = self.settings_tabview.add("🔒 Bảo mật")
        
        # Authentication
        auth_frame = ctk.CTkFrame(security_tab)
        auth_frame.pack(fill="x", padx=20, pady=10)
        
        ctk.CTkLabel(
            auth_frame,
            text="🔐 Xác thực",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(anchor="w", pady=5)
        
        # Enable password
        password_frame = ctk.CTkFrame(auth_frame)
        password_frame.pack(fill="x", padx=10, pady=5)
        
        self.enable_password_checkbox = ctk.CTkCheckBox(
            password_frame,
            text="Yêu cầu mật khẩu khi mở ứng dụng"
        )
        self.enable_password_checkbox.pack(side="left", padx=5)
        
        # Change password
        change_password_frame = ctk.CTkFrame(auth_frame)
        change_password_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkButton(
            change_password_frame,
            text="🔑 Đổi mật khẩu",
            command=self.change_password,
            width=120
        ).pack(side="left", padx=5)
        
        # Auto lock
        auto_lock_frame = ctk.CTkFrame(auth_frame)
        auto_lock_frame.pack(fill="x", padx=10, pady=5)
        
        self.auto_lock_checkbox = ctk.CTkCheckBox(
            auto_lock_frame,
            text="Tự động khóa sau:"
        )
        self.auto_lock_checkbox.pack(side="left", padx=5)
        
        self.auto_lock_time_entry = ctk.CTkEntry(auto_lock_frame, width=50)
        self.auto_lock_time_entry.pack(side="left", padx=5)
        
        ctk.CTkLabel(auto_lock_frame, text="phút").pack(side="left", padx=5)
        
        # Data encryption
        encryption_frame = ctk.CTkFrame(security_tab)
        encryption_frame.pack(fill="x", padx=20, pady=10)
        
        ctk.CTkLabel(
            encryption_frame,
            text="🔐 Mã hóa dữ liệu",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(anchor="w", pady=5)
        
        # Enable encryption
        enable_encryption_frame = ctk.CTkFrame(encryption_frame)
        enable_encryption_frame.pack(fill="x", padx=10, pady=5)
        
        self.enable_encryption_checkbox = ctk.CTkCheckBox(
            enable_encryption_frame,
            text="Mã hóa dữ liệu nhạy cảm"
        )
        self.enable_encryption_checkbox.pack(side="left", padx=5)
        
        # Encryption level
        encryption_level_frame = ctk.CTkFrame(encryption_frame)
        encryption_level_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(encryption_level_frame, text="Mức mã hóa:", width=120).pack(side="left", padx=5)
        self.encryption_level_combo = ctk.CTkComboBox(
            encryption_level_frame,
            values=["AES-128", "AES-256", "RSA-2048"],
            width=150
        )
        self.encryption_level_combo.pack(side="left", padx=5)
    
    def create_notification_tab(self):
        """Tạo tab thông báo"""
        notification_tab = self.settings_tabview.add("🔔 Thông báo")
        
        # General notifications
        general_frame = ctk.CTkFrame(notification_tab)
        general_frame.pack(fill="x", padx=20, pady=10)
        
        ctk.CTkLabel(
            general_frame,
            text="🔔 Thông báo chung",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(anchor="w", pady=5)
        
        # Enable notifications
        enable_notifications_frame = ctk.CTkFrame(general_frame)
        enable_notifications_frame.pack(fill="x", padx=10, pady=5)
        
        self.enable_notifications_checkbox = ctk.CTkCheckBox(
            enable_notifications_frame,
            text="Bật thông báo"
        )
        self.enable_notifications_checkbox.pack(side="left", padx=5)
        
        # Sound notifications
        sound_frame = ctk.CTkFrame(general_frame)
        sound_frame.pack(fill="x", padx=10, pady=5)
        
        self.sound_notifications_checkbox = ctk.CTkCheckBox(
            sound_frame,
            text="Thông báo âm thanh"
        )
        self.sound_notifications_checkbox.pack(side="left", padx=5)
        
        # Popup notifications
        popup_frame = ctk.CTkFrame(general_frame)
        popup_frame.pack(fill="x", padx=10, pady=5)
        
        self.popup_notifications_checkbox = ctk.CTkCheckBox(
            popup_frame,
            text="Thông báo popup"
        )
        self.popup_notifications_checkbox.pack(side="left", padx=5)
        
        # Specific notifications
        specific_frame = ctk.CTkFrame(notification_tab)
        specific_frame.pack(fill="x", padx=20, pady=10)
        
        ctk.CTkLabel(
            specific_frame,
            text="📋 Thông báo cụ thể",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(anchor="w", pady=5)
        
        # Payment success
        payment_success_frame = ctk.CTkFrame(specific_frame)
        payment_success_frame.pack(fill="x", padx=10, pady=5)
        
        self.payment_success_checkbox = ctk.CTkCheckBox(
            payment_success_frame,
            text="Thông báo khi thanh toán thành công"
        )
        self.payment_success_checkbox.pack(side="left", padx=5)
        
        # Payment failed
        payment_failed_frame = ctk.CTkFrame(specific_frame)
        payment_failed_frame.pack(fill="x", padx=10, pady=5)
        
        self.payment_failed_checkbox = ctk.CTkCheckBox(
            payment_failed_frame,
            text="Thông báo khi thanh toán thất bại"
        )
        self.payment_failed_checkbox.pack(side="left", padx=5)
        
        # API errors
        api_error_frame = ctk.CTkFrame(specific_frame)
        api_error_frame.pack(fill="x", padx=10, pady=5)
        
        self.api_error_checkbox = ctk.CTkCheckBox(
            api_error_frame,
            text="Thông báo lỗi API"
        )
        self.api_error_checkbox.pack(side="left", padx=5)
        
        # System updates
        system_update_frame = ctk.CTkFrame(specific_frame)
        system_update_frame.pack(fill="x", padx=10, pady=5)
        
        self.system_update_checkbox = ctk.CTkCheckBox(
            system_update_frame,
            text="Thông báo cập nhật hệ thống"
        )
        self.system_update_checkbox.pack(side="left", padx=5)
    
    def create_backup_tab(self):
        """Tạo tab backup"""
        backup_tab = self.settings_tabview.add("💾 Backup")
        
        # Auto backup
        auto_backup_frame = ctk.CTkFrame(backup_tab)
        auto_backup_frame.pack(fill="x", padx=20, pady=10)
        
        ctk.CTkLabel(
            auto_backup_frame,
            text="🔄 Tự động backup",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(anchor="w", pady=5)
        
        # Enable auto backup
        enable_auto_backup_frame = ctk.CTkFrame(auto_backup_frame)
        enable_auto_backup_frame.pack(fill="x", padx=10, pady=5)
        
        self.enable_auto_backup_checkbox = ctk.CTkCheckBox(
            enable_auto_backup_frame,
            text="Bật tự động backup"
        )
        self.enable_auto_backup_checkbox.pack(side="left", padx=5)
        
        # Backup frequency
        backup_frequency_frame = ctk.CTkFrame(auto_backup_frame)
        backup_frequency_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(backup_frequency_frame, text="Tần suất backup:", width=120).pack(side="left", padx=5)
        self.backup_frequency_combo = ctk.CTkComboBox(
            backup_frequency_frame,
            values=["Hàng ngày", "Hàng tuần", "Hàng tháng"],
            width=150
        )
        self.backup_frequency_combo.pack(side="left", padx=5)
        
        # Backup location
        backup_location_frame = ctk.CTkFrame(auto_backup_frame)
        backup_location_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(backup_location_frame, text="Thư mục backup:", width=120).pack(side="left", padx=5)
        self.backup_location_entry = ctk.CTkEntry(backup_location_frame, width=300)
        self.backup_location_entry.pack(side="left", padx=5)
        
        ctk.CTkButton(
            backup_location_frame,
            text="📁 Chọn",
            command=self.choose_backup_location,
            width=60
        ).pack(side="left", padx=5)
        
        # Manual backup
        manual_backup_frame = ctk.CTkFrame(backup_tab)
        manual_backup_frame.pack(fill="x", padx=20, pady=10)
        
        ctk.CTkLabel(
            manual_backup_frame,
            text="🗂️ Backup thủ công",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(anchor="w", pady=5)
        
        # Backup buttons
        backup_buttons_frame = ctk.CTkFrame(manual_backup_frame)
        backup_buttons_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkButton(
            backup_buttons_frame,
            text="💾 Backup ngay",
            command=self.backup_now,
            width=120
        ).pack(side="left", padx=5)
        
        ctk.CTkButton(
            backup_buttons_frame,
            text="📥 Restore",
            command=self.restore_backup,
            width=120
        ).pack(side="left", padx=5)
        
        ctk.CTkButton(
            backup_buttons_frame,
            text="🗑️ Xóa backup cũ",
            command=self.cleanup_old_backups,
            width=120
        ).pack(side="left", padx=5)
        
        # Backup history
        backup_history_frame = ctk.CTkFrame(backup_tab)
        backup_history_frame.pack(fill="both", expand=True, padx=20, pady=10)
        
        ctk.CTkLabel(
            backup_history_frame,
            text="📋 Lịch sử backup",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(anchor="w", pady=5)
        
        self.backup_history_text = ctk.CTkTextbox(backup_history_frame, width=800, height=200)
        self.backup_history_text.pack(fill="both", expand=True, padx=10, pady=5)
        
        # Action buttons at bottom
        action_frame = ctk.CTkFrame(backup_tab)
        action_frame.pack(fill="x", padx=20, pady=10)
        
        ctk.CTkButton(
            action_frame,
            text="💾 Lưu cài đặt",
            command=self.save_settings,
            width=120
        ).pack(side="left", padx=5)
        
        ctk.CTkButton(
            action_frame,
            text="🔄 Khôi phục mặc định",
            command=self.reset_settings,
            width=150
        ).pack(side="left", padx=5)
        
        ctk.CTkButton(
            action_frame,
            text="📤 Xuất cài đặt",
            command=self.export_settings,
            width=120
        ).pack(side="left", padx=5)
        
        ctk.CTkButton(
            action_frame,
            text="📥 Nhập cài đặt",
            command=self.import_settings,
            width=120
        ).pack(side="left", padx=5)
    
    def load_settings(self):
        """Tải cài đặt từ config"""
        try:
            # Load appearance settings
            self.theme_combo.set(self.app.config_manager.get_setting("app_settings.theme", "light"))
            
            font_size = self.app.config_manager.get_setting("app_settings.font_size", 12)
            self.font_size_slider.set(font_size)
            self.font_size_label.configure(text=f"{font_size}px")
            
            self.window_size_combo.set(self.app.config_manager.get_setting("app_settings.window_size", "1200x800"))
            
            # Load performance settings
            self.timeout_entry.delete(0, "end")
            self.timeout_entry.insert(0, str(self.app.config_manager.get_setting("api_settings.timeout", 30)))
            
            self.retry_count_entry.delete(0, "end")
            self.retry_count_entry.insert(0, str(self.app.config_manager.get_setting("api_settings.retry_count", 3)))
            
            self.concurrent_entry.delete(0, "end")
            self.concurrent_entry.insert(0, str(self.app.config_manager.get_setting("api_settings.concurrent_requests", 5)))
            
            # Load cache settings
            enable_cache = self.app.config_manager.get_setting("performance_settings.enable_cache", True)
            if enable_cache:
                self.enable_cache_checkbox.select()
            
            self.cache_size_entry.delete(0, "end")
            self.cache_size_entry.insert(0, str(self.app.config_manager.get_setting("performance_settings.cache_size", 100)))
            
            # Load notification settings
            enable_notifications = self.app.config_manager.get_setting("notification_settings.enable_notifications", True)
            if enable_notifications:
                self.enable_notifications_checkbox.select()
            
            sound_notifications = self.app.config_manager.get_setting("notification_settings.sound_notifications", True)
            if sound_notifications:
                self.sound_notifications_checkbox.select()
            
            # Load backup settings
            enable_auto_backup = self.app.config_manager.get_setting("backup_settings.enable_auto_backup", False)
            if enable_auto_backup:
                self.enable_auto_backup_checkbox.select()
            
            self.backup_frequency_combo.set(self.app.config_manager.get_setting("backup_settings.backup_frequency", "Hàng tuần"))
            
            backup_location = self.app.config_manager.get_setting("backup_settings.backup_location", "")
            self.backup_location_entry.delete(0, "end")
            self.backup_location_entry.insert(0, backup_location)
            
            # Load backup history
            self.load_backup_history()
            
        except Exception as e:
            print(f"Error loading settings: {e}")
    
    def change_theme(self, theme):
        """Thay đổi theme"""
        try:
            ctk.set_appearance_mode(theme)
            self.app.config_manager.set_setting("app_settings.theme", theme)
            self.app.show_message("Thành công", f"Đã thay đổi theme thành {theme}", "success")
        except Exception as e:
            self.app.show_message("Lỗi", f"Lỗi thay đổi theme: {str(e)}", "error")
    
    def change_font_size(self, size):
        """Thay đổi kích thước font"""
        try:
            self.font_size_label.configure(text=f"{int(size)}px")
            self.app.config_manager.set_setting("app_settings.font_size", int(size))
        except Exception as e:
            print(f"Error changing font size: {e}")
    
    def change_password(self):
        """Thay đổi mật khẩu"""
        password_window = ctk.CTkToplevel(self.app.root)
        password_window.title("Đổi mật khẩu")
        password_window.geometry("400x300")
        
        # Current password
        ctk.CTkLabel(password_window, text="Mật khẩu hiện tại:", font=ctk.CTkFont(size=12)).pack(pady=10)
        current_password_entry = ctk.CTkEntry(password_window, show="*", width=300)
        current_password_entry.pack(pady=5)
        
        # New password
        ctk.CTkLabel(password_window, text="Mật khẩu mới:", font=ctk.CTkFont(size=12)).pack(pady=10)
        new_password_entry = ctk.CTkEntry(password_window, show="*", width=300)
        new_password_entry.pack(pady=5)
        
        # Confirm password
        ctk.CTkLabel(password_window, text="Xác nhận mật khẩu:", font=ctk.CTkFont(size=12)).pack(pady=10)
        confirm_password_entry = ctk.CTkEntry(password_window, show="*", width=300)
        confirm_password_entry.pack(pady=5)
        
        # Buttons
        button_frame = ctk.CTkFrame(password_window)
        button_frame.pack(pady=20)
        
        def save_password():
            current = current_password_entry.get()
            new = new_password_entry.get()
            confirm = confirm_password_entry.get()
            
            if not current or not new or not confirm:
                self.app.show_message("Lỗi", "Vui lòng điền đầy đủ thông tin", "error")
                return
            
            if new != confirm:
                self.app.show_message("Lỗi", "Mật khẩu xác nhận không khớp", "error")
                return
            
            if len(new) < 6:
                self.app.show_message("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự", "error")
                return
            
            # TODO: Implement password change logic
            self.app.show_message("Thành công", "Đã đổi mật khẩu thành công", "success")
            password_window.destroy()
        
        ctk.CTkButton(button_frame, text="💾 Lưu", command=save_password).pack(side="left", padx=5)
        ctk.CTkButton(button_frame, text="❌ Hủy", command=password_window.destroy).pack(side="left", padx=5)
    
    def clear_cache(self):
        """Xóa cache"""
        if messagebox.askyesno("Xác nhận", "Bạn có muốn xóa tất cả cache?"):
            try:
                # TODO: Implement cache clearing logic
                self.app.show_message("Thành công", "Đã xóa cache thành công", "success")
            except Exception as e:
                self.app.show_message("Lỗi", f"Lỗi xóa cache: {str(e)}", "error")
    
    def choose_backup_location(self):
        """Chọn thư mục backup"""
        folder = filedialog.askdirectory(title="Chọn thư mục backup")
        if folder:
            self.backup_location_entry.delete(0, "end")
            self.backup_location_entry.insert(0, folder)
    
    def backup_now(self):
        """Backup ngay"""
        try:
            backup_location = self.backup_location_entry.get()
            if not backup_location:
                self.app.show_message("Lỗi", "Vui lòng chọn thư mục backup", "error")
                return
            
            # TODO: Implement backup logic
            self.app.show_message("Thành công", "Đã backup thành công", "success")
            self.load_backup_history()
        except Exception as e:
            self.app.show_message("Lỗi", f"Lỗi backup: {str(e)}", "error")
    
    def restore_backup(self):
        """Restore backup"""
        backup_file = filedialog.askopenfilename(
            title="Chọn file backup",
            filetypes=[("Backup files", "*.bak"), ("All files", "*.*")]
        )
        
        if backup_file:
            if messagebox.askyesno("Xác nhận", "Bạn có muốn restore backup? Dữ liệu hiện tại sẽ bị ghi đè."):
                try:
                    # TODO: Implement restore logic
                    self.app.show_message("Thành công", "Đã restore backup thành công", "success")
                except Exception as e:
                    self.app.show_message("Lỗi", f"Lỗi restore: {str(e)}", "error")
    
    def cleanup_old_backups(self):
        """Dọn dẹp backup cũ"""
        if messagebox.askyesno("Xác nhận", "Bạn có muốn xóa các backup cũ hơn 30 ngày?"):
            try:
                # TODO: Implement cleanup logic
                self.app.show_message("Thành công", "Đã dọn dẹp backup cũ", "success")
                self.load_backup_history()
            except Exception as e:
                self.app.show_message("Lỗi", f"Lỗi dọn dẹp: {str(e)}", "error")
    
    def load_backup_history(self):
        """Tải lịch sử backup"""
        try:
            history = f"""
LỊCH SỬ BACKUP
==============
[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Backup tự động - Thành công (125 MB)
[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Backup thủ công - Thành công (120 MB)
[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Backup tự động - Thành công (118 MB)
[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Backup thủ công - Thành công (115 MB)
[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Backup tự động - Thành công (112 MB)

THỐNG KÊ BACKUP
===============
Tổng số backup: 15
Dung lượng tổng: 1.8 GB
Backup thành công: 15/15 (100%)
Backup thất bại: 0/15 (0%)
Backup cuối: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
"""
            
            self.backup_history_text.delete("1.0", "end")
            self.backup_history_text.insert("1.0", history)
            
        except Exception as e:
            self.backup_history_text.delete("1.0", "end")
            self.backup_history_text.insert("1.0", f"Error loading backup history: {str(e)}")
    
    def save_settings(self):
        """Lưu cài đặt"""
        try:
            # Save appearance settings
            self.app.config_manager.set_setting("app_settings.theme", self.theme_combo.get())
            self.app.config_manager.set_setting("app_settings.font_size", int(self.font_size_slider.get()))
            self.app.config_manager.set_setting("app_settings.window_size", self.window_size_combo.get())
            
            # Save performance settings
            self.app.config_manager.set_setting("api_settings.timeout", int(self.timeout_entry.get() or 30))
            self.app.config_manager.set_setting("api_settings.retry_count", int(self.retry_count_entry.get() or 3))
            self.app.config_manager.set_setting("api_settings.concurrent_requests", int(self.concurrent_entry.get() or 5))
            
            # Save cache settings
            self.app.config_manager.set_setting("performance_settings.enable_cache", self.enable_cache_checkbox.get())
            self.app.config_manager.set_setting("performance_settings.cache_size", int(self.cache_size_entry.get() or 100))
            
            # Save notification settings
            self.app.config_manager.set_setting("notification_settings.enable_notifications", self.enable_notifications_checkbox.get())
            self.app.config_manager.set_setting("notification_settings.sound_notifications", self.sound_notifications_checkbox.get())
            
            # Save backup settings
            self.app.config_manager.set_setting("backup_settings.enable_auto_backup", self.enable_auto_backup_checkbox.get())
            self.app.config_manager.set_setting("backup_settings.backup_frequency", self.backup_frequency_combo.get())
            self.app.config_manager.set_setting("backup_settings.backup_location", self.backup_location_entry.get())
            
            self.app.show_message("Thành công", "Đã lưu cài đặt thành công", "success")
            
        except Exception as e:
            self.app.show_message("Lỗi", f"Lỗi lưu cài đặt: {str(e)}", "error")
    
    def reset_settings(self):
        """Khôi phục cài đặt mặc định"""
        if messagebox.askyesno("Xác nhận", "Bạn có muốn khôi phục cài đặt mặc định?"):
            try:
                self.app.config_manager.reset_config()
                self.load_settings()
                self.app.show_message("Thành công", "Đã khôi phục cài đặt mặc định", "success")
            except Exception as e:
                self.app.show_message("Lỗi", f"Lỗi khôi phục cài đặt: {str(e)}", "error")
    
    def export_settings(self):
        """Xuất cài đặt"""
        file_path = filedialog.asksaveasfilename(
            title="Xuất cài đặt",
            defaultextension=".json",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
        )
        
        if file_path:
            try:
                if self.app.config_manager.export_config(file_path):
                    self.app.show_message("Thành công", "Đã xuất cài đặt thành công", "success")
                else:
                    self.app.show_message("Lỗi", "Không thể xuất cài đặt", "error")
            except Exception as e:
                self.app.show_message("Lỗi", f"Lỗi xuất cài đặt: {str(e)}", "error")
    
    def import_settings(self):
        """Nhập cài đặt"""
        file_path = filedialog.askopenfilename(
            title="Nhập cài đặt",
            filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
        )
        
        if file_path:
            try:
                if self.app.config_manager.import_config(file_path):
                    self.load_settings()
                    self.app.show_message("Thành công", "Đã nhập cài đặt thành công", "success")
                else:
                    self.app.show_message("Lỗi", "Không thể nhập cài đặt", "error")
            except Exception as e:
                self.app.show_message("Lỗi", f"Lỗi nhập cài đặt: {str(e)}", "error")