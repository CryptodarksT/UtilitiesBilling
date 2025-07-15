import os
import sys
import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import customtkinter as ctk
from CTkMessagebox import CTkMessagebox
import json
import threading
from datetime import datetime
import webbrowser

# Import các modules của ứng dụng
from src.api.bidv_service import BIDVService
from src.api.momo_service import MoMoService
from src.api.visa_service import VisaService
from src.api.zalopay_service import ZaloPayService
from src.gui.bill_lookup_frame import BillLookupFrame
from src.gui.payment_frame import PaymentFrame
from src.gui.history_frame import HistoryFrame
from src.gui.settings_frame import SettingsFrame
from src.gui.admin_frame import AdminFrame
from src.gui.status_frame import StatusFrame
from src.utils.config_manager import ConfigManager
from src.utils.excel_processor import ExcelProcessor

# Cấu hình CustomTkinter
ctk.set_appearance_mode("light")
ctk.set_default_color_theme("blue")

class PayooDesktopApp:
    def __init__(self):
        self.root = ctk.CTk()
        self.root.title("Payoo Desktop - Hệ thống thanh toán hóa đơn")
        self.root.geometry("1200x800")
        
        # Thiết lập icon
        try:
            self.root.iconbitmap("assets/icon.ico")
        except:
            pass
        
        # Khởi tạo services
        self.config_manager = ConfigManager()
        self.excel_processor = ExcelProcessor()
        self.init_services()
        
        # Tạo giao diện
        self.create_ui()
        
        # Tải cấu hình
        self.load_config()
        
    def init_services(self):
        """Khởi tạo các service API"""
        try:
            self.bidv_service = BIDVService()
            self.momo_service = MoMoService()
            self.visa_service = VisaService()
            self.zalopay_service = ZaloPayService()
        except Exception as e:
            print(f"Lỗi khởi tạo services: {e}")
    
    def create_ui(self):
        """Tạo giao diện chính"""
        # Main container
        self.main_frame = ctk.CTkFrame(self.root)
        self.main_frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        # Header
        self.create_header()
        
        # Content area với tabview
        self.create_content_area()
        
        # Footer
        self.create_footer()
    
    def create_header(self):
        """Tạo header với logo và thông tin"""
        header_frame = ctk.CTkFrame(self.main_frame)
        header_frame.pack(fill="x", pady=(0, 10))
        
        # Logo và tiêu đề
        title_frame = ctk.CTkFrame(header_frame)
        title_frame.pack(side="left", padx=10, pady=10)
        
        title_label = ctk.CTkLabel(
            title_frame,
            text="💳 PAYOO DESKTOP",
            font=ctk.CTkFont(size=24, weight="bold")
        )
        title_label.pack(pady=5)
        
        subtitle_label = ctk.CTkLabel(
            title_frame,
            text="Hệ thống thanh toán hóa đơn tiện ích",
            font=ctk.CTkFont(size=12)
        )
        subtitle_label.pack()
        
        # Thông tin trạng thái
        status_frame = ctk.CTkFrame(header_frame)
        status_frame.pack(side="right", padx=10, pady=10)
        
        self.status_label = ctk.CTkLabel(
            status_frame,
            text="🟢 Hệ thống hoạt động tốt",
            font=ctk.CTkFont(size=12)
        )
        self.status_label.pack(pady=2)
        
        self.time_label = ctk.CTkLabel(
            status_frame,
            text=f"Cập nhật: {datetime.now().strftime('%H:%M:%S')}",
            font=ctk.CTkFont(size=10)
        )
        self.time_label.pack(pady=2)
        
        # Cập nhật thời gian
        self.update_time()
    
    def create_content_area(self):
        """Tạo khu vực nội dung chính"""
        # Tabview
        self.tabview = ctk.CTkTabview(self.main_frame, width=1000, height=600)
        self.tabview.pack(fill="both", expand=True, pady=10)
        
        # Các tab
        self.create_tabs()
    
    def create_tabs(self):
        """Tạo các tab chính"""
        # Tab tra cứu hóa đơn
        bill_tab = self.tabview.add("🔍 Tra cứu hóa đơn")
        self.bill_lookup_frame = BillLookupFrame(bill_tab, self)
        
        # Tab thanh toán
        payment_tab = self.tabview.add("💳 Thanh toán")
        self.payment_frame = PaymentFrame(payment_tab, self)
        
        # Tab lịch sử
        history_tab = self.tabview.add("📋 Lịch sử")
        self.history_frame = HistoryFrame(history_tab, self)
        
        # Tab trạng thái API
        status_tab = self.tabview.add("📊 Trạng thái API")
        self.status_frame = StatusFrame(status_tab, self)
        
        # Tab quản trị
        admin_tab = self.tabview.add("⚙️ Quản trị")
        self.admin_frame = AdminFrame(admin_tab, self)
        
        # Tab cài đặt
        settings_tab = self.tabview.add("🔧 Cài đặt")
        self.settings_frame = SettingsFrame(settings_tab, self)
    
    def create_footer(self):
        """Tạo footer"""
        footer_frame = ctk.CTkFrame(self.main_frame)
        footer_frame.pack(fill="x", pady=(10, 0))
        
        # Thông tin phiên bản
        version_label = ctk.CTkLabel(
            footer_frame,
            text="Payoo Desktop v2.0.0 - 100% Real API Integration",
            font=ctk.CTkFont(size=10)
        )
        version_label.pack(side="left", padx=10, pady=5)
        
        # Nút hỗ trợ
        support_button = ctk.CTkButton(
            footer_frame,
            text="📞 Hỗ trợ",
            width=100,
            command=self.open_support
        )
        support_button.pack(side="right", padx=10, pady=5)
        
        # Nút tài liệu
        docs_button = ctk.CTkButton(
            footer_frame,
            text="📚 Tài liệu",
            width=100,
            command=self.open_docs
        )
        docs_button.pack(side="right", padx=5, pady=5)
    
    def update_time(self):
        """Cập nhật thời gian hiện tại"""
        current_time = datetime.now().strftime('%H:%M:%S')
        self.time_label.configure(text=f"Cập nhật: {current_time}")
        self.root.after(1000, self.update_time)
    
    def load_config(self):
        """Tải cấu hình từ file"""
        try:
            config = self.config_manager.load_config()
            if config:
                # Áp dụng cấu hình
                self.apply_config(config)
        except Exception as e:
            print(f"Lỗi tải cấu hình: {e}")
    
    def apply_config(self, config):
        """Áp dụng cấu hình"""
        # Áp dụng theme
        if "theme" in config:
            ctk.set_appearance_mode(config["theme"])
        
        # Áp dụng cấu hình API
        if "api_config" in config:
            self.update_api_config(config["api_config"])
    
    def update_api_config(self, api_config):
        """Cập nhật cấu hình API"""
        # Cập nhật cấu hình cho các service
        pass
    
    def open_support(self):
        """Mở trang hỗ trợ"""
        webbrowser.open("https://payoo.vn/support")
    
    def open_docs(self):
        """Mở tài liệu"""
        webbrowser.open("https://payoo.vn/docs")
    
    def show_message(self, title, message, msg_type="info"):
        """Hiển thị thông báo"""
        if msg_type == "info":
            CTkMessagebox(title=title, message=message, icon="info")
        elif msg_type == "warning":
            CTkMessagebox(title=title, message=message, icon="warning")
        elif msg_type == "error":
            CTkMessagebox(title=title, message=message, icon="cancel")
        elif msg_type == "success":
            CTkMessagebox(title=title, message=message, icon="check")
    
    def run(self):
        """Chạy ứng dụng"""
        self.root.mainloop()

def main():
    """Hàm main"""
    try:
        app = PayooDesktopApp()
        app.run()
    except Exception as e:
        print(f"Lỗi khởi động ứng dụng: {e}")
        messagebox.showerror("Lỗi", f"Không thể khởi động ứng dụng: {e}")

if __name__ == "__main__":
    main()