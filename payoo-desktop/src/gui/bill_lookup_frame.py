import customtkinter as ctk
from tkinter import ttk, messagebox
import threading
import json
from datetime import datetime

class BillLookupFrame:
    """Frame tra cứu hóa đơn"""
    
    def __init__(self, parent, app):
        self.parent = parent
        self.app = app
        self.create_ui()
    
    def create_ui(self):
        """Tạo giao diện tra cứu hóa đơn"""
        # Main container
        main_frame = ctk.CTkFrame(self.parent)
        main_frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # Title
        title_label = ctk.CTkLabel(
            main_frame,
            text="🔍 TRA CỨU HÓA ĐƠN",
            font=ctk.CTkFont(size=20, weight="bold")
        )
        title_label.pack(pady=10)
        
        # Search form
        self.create_search_form(main_frame)
        
        # Results area
        self.create_results_area(main_frame)
    
    def create_search_form(self, parent):
        """Tạo form tìm kiếm"""
        search_frame = ctk.CTkFrame(parent)
        search_frame.pack(fill="x", pady=10)
        
        # Search by bill number
        bill_frame = ctk.CTkFrame(search_frame)
        bill_frame.pack(fill="x", padx=20, pady=10)
        
        ctk.CTkLabel(bill_frame, text="Mã hóa đơn:", font=ctk.CTkFont(size=12, weight="bold")).pack(anchor="w", pady=5)
        
        self.bill_number_entry = ctk.CTkEntry(
            bill_frame,
            placeholder_text="Nhập mã hóa đơn (VD: PD29007350490)",
            width=300
        )
        self.bill_number_entry.pack(side="left", padx=5)
        
        search_button = ctk.CTkButton(
            bill_frame,
            text="Tìm kiếm",
            command=self.search_by_bill_number,
            width=100
        )
        search_button.pack(side="left", padx=5)
        
        # Search by customer info
        customer_frame = ctk.CTkFrame(search_frame)
        customer_frame.pack(fill="x", padx=20, pady=10)
        
        ctk.CTkLabel(customer_frame, text="Tìm kiếm theo thông tin khách hàng:", font=ctk.CTkFont(size=12, weight="bold")).pack(anchor="w", pady=5)
        
        # Row 1
        row1_frame = ctk.CTkFrame(customer_frame)
        row1_frame.pack(fill="x", pady=5)
        
        ctk.CTkLabel(row1_frame, text="Mã khách hàng:", width=120).pack(side="left", padx=5)
        self.customer_id_entry = ctk.CTkEntry(row1_frame, width=200, placeholder_text="Nhập mã khách hàng")
        self.customer_id_entry.pack(side="left", padx=5)
        
        ctk.CTkLabel(row1_frame, text="Loại hóa đơn:", width=120).pack(side="left", padx=5)
        self.bill_type_combo = ctk.CTkComboBox(
            row1_frame,
            values=["Điện", "Nước", "Internet", "Truyền hình", "Điện thoại"],
            width=150
        )
        self.bill_type_combo.pack(side="left", padx=5)
        
        # Row 2
        row2_frame = ctk.CTkFrame(customer_frame)
        row2_frame.pack(fill="x", pady=5)
        
        ctk.CTkLabel(row2_frame, text="Nhà cung cấp:", width=120).pack(side="left", padx=5)
        self.provider_combo = ctk.CTkComboBox(
            row2_frame,
            values=["EVN TP.HCM", "EVN Hà Nội", "SAWACO", "VNPT", "Viettel"],
            width=200
        )
        self.provider_combo.pack(side="left", padx=5)
        
        search_customer_button = ctk.CTkButton(
            row2_frame,
            text="Tìm kiếm",
            command=self.search_by_customer,
            width=100
        )
        search_customer_button.pack(side="left", padx=20)
        
        # Progress bar
        self.progress_bar = ctk.CTkProgressBar(search_frame, width=400)
        self.progress_bar.pack(pady=10)
        self.progress_bar.set(0)
        
        # Status label
        self.status_label = ctk.CTkLabel(search_frame, text="Sẵn sàng tìm kiếm", font=ctk.CTkFont(size=10))
        self.status_label.pack(pady=5)
    
    def create_results_area(self, parent):
        """Tạo khu vực hiển thị kết quả"""
        results_frame = ctk.CTkFrame(parent)
        results_frame.pack(fill="both", expand=True, pady=10)
        
        # Results title
        results_title = ctk.CTkLabel(
            results_frame,
            text="📋 KẾT QUẢ TÌM KIẾM",
            font=ctk.CTkFont(size=16, weight="bold")
        )
        results_title.pack(pady=10)
        
        # Results container
        self.results_container = ctk.CTkScrollableFrame(results_frame, width=800, height=300)
        self.results_container.pack(fill="both", expand=True, padx=20, pady=10)
        
        # No results label
        self.no_results_label = ctk.CTkLabel(
            self.results_container,
            text="Chưa có kết quả tìm kiếm",
            font=ctk.CTkFont(size=12),
            text_color="gray"
        )
        self.no_results_label.pack(pady=50)
    
    def search_by_bill_number(self):
        """Tìm kiếm theo mã hóa đơn"""
        bill_number = self.bill_number_entry.get().strip()
        
        if not bill_number:
            self.app.show_message("Lỗi", "Vui lòng nhập mã hóa đơn", "error")
            return
        
        # Chạy tìm kiếm trong thread riêng
        thread = threading.Thread(target=self._search_bill_thread, args=(bill_number,))
        thread.start()
    
    def search_by_customer(self):
        """Tìm kiếm theo thông tin khách hàng"""
        customer_id = self.customer_id_entry.get().strip()
        bill_type = self.bill_type_combo.get()
        provider = self.provider_combo.get()
        
        if not customer_id:
            self.app.show_message("Lỗi", "Vui lòng nhập mã khách hàng", "error")
            return
        
        # Chạy tìm kiếm trong thread riêng
        thread = threading.Thread(target=self._search_customer_thread, args=(customer_id, bill_type, provider))
        thread.start()
    
    def _search_bill_thread(self, bill_number):
        """Thread tìm kiếm hóa đơn"""
        try:
            # Cập nhật UI
            self.progress_bar.set(0.1)
            self.status_label.configure(text="Đang tìm kiếm...")
            
            # Gọi API BIDV
            self.progress_bar.set(0.5)
            result = self.app.bidv_service.lookup_bill(bill_number)
            
            self.progress_bar.set(1.0)
            self.status_label.configure(text="Hoàn thành")
            
            # Hiển thị kết quả
            self.display_results([result])
            
        except Exception as e:
            self.progress_bar.set(0)
            self.status_label.configure(text=f"Lỗi: {str(e)}")
            self.app.show_message("Lỗi", f"Không thể tìm kiếm: {str(e)}", "error")
    
    def _search_customer_thread(self, customer_id, bill_type, provider):
        """Thread tìm kiếm theo khách hàng"""
        try:
            # Cập nhật UI
            self.progress_bar.set(0.1)
            self.status_label.configure(text="Đang tìm kiếm...")
            
            # Gọi API tìm kiếm
            self.progress_bar.set(0.5)
            result = self.app.bidv_service.lookup_bill(customer_id)
            
            self.progress_bar.set(1.0)
            self.status_label.configure(text="Hoàn thành")
            
            # Hiển thị kết quả
            self.display_results([result])
            
        except Exception as e:
            self.progress_bar.set(0)
            self.status_label.configure(text=f"Lỗi: {str(e)}")
            self.app.show_message("Lỗi", f"Không thể tìm kiếm: {str(e)}", "error")
    
    def display_results(self, results):
        """Hiển thị kết quả tìm kiếm"""
        # Xóa kết quả cũ
        for widget in self.results_container.winfo_children():
            widget.destroy()
        
        if not results or not results[0].get("success"):
            self.no_results_label = ctk.CTkLabel(
                self.results_container,
                text="Không tìm thấy hóa đơn",
                font=ctk.CTkFont(size=12),
                text_color="gray"
            )
            self.no_results_label.pack(pady=50)
            return
        
        for result in results:
            if result.get("success"):
                self.create_bill_card(result)
    
    def create_bill_card(self, result):
        """Tạo card hiển thị thông tin hóa đơn"""
        bill = result.get("bill", {})
        customer = result.get("customer", {})
        
        # Card container
        card_frame = ctk.CTkFrame(self.results_container)
        card_frame.pack(fill="x", padx=10, pady=10)
        
        # Header
        header_frame = ctk.CTkFrame(card_frame)
        header_frame.pack(fill="x", padx=10, pady=5)
        
        bill_title = ctk.CTkLabel(
            header_frame,
            text=f"💡 Hóa đơn {bill.get('billType', 'Điện').upper()}: {bill.get('billNumber', 'N/A')}",
            font=ctk.CTkFont(size=14, weight="bold")
        )
        bill_title.pack(side="left")
        
        status_label = ctk.CTkLabel(
            header_frame,
            text=f"🔴 {bill.get('status', 'Chưa thanh toán').upper()}",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color="red"
        )
        status_label.pack(side="right")
        
        # Content
        content_frame = ctk.CTkFrame(card_frame)
        content_frame.pack(fill="x", padx=10, pady=5)
        
        # Left column - Customer info
        left_frame = ctk.CTkFrame(content_frame)
        left_frame.pack(side="left", fill="both", expand=True, padx=5)
        
        ctk.CTkLabel(left_frame, text="THÔNG TIN KHÁCH HÀNG", font=ctk.CTkFont(size=12, weight="bold")).pack(anchor="w", pady=2)
        ctk.CTkLabel(left_frame, text=f"Tên: {customer.get('name', 'N/A')}", font=ctk.CTkFont(size=10)).pack(anchor="w")
        ctk.CTkLabel(left_frame, text=f"Địa chỉ: {customer.get('address', 'N/A')}", font=ctk.CTkFont(size=10)).pack(anchor="w")
        ctk.CTkLabel(left_frame, text=f"Điện thoại: {customer.get('phone', 'N/A')}", font=ctk.CTkFont(size=10)).pack(anchor="w")
        ctk.CTkLabel(left_frame, text=f"Email: {customer.get('email', 'N/A')}", font=ctk.CTkFont(size=10)).pack(anchor="w")
        
        # Right column - Bill info
        right_frame = ctk.CTkFrame(content_frame)
        right_frame.pack(side="right", fill="both", expand=True, padx=5)
        
        ctk.CTkLabel(right_frame, text="THÔNG TIN HÓA ĐƠN", font=ctk.CTkFont(size=12, weight="bold")).pack(anchor="w", pady=2)
        ctk.CTkLabel(right_frame, text=f"Kỳ: {bill.get('period', 'N/A')}", font=ctk.CTkFont(size=10)).pack(anchor="w")
        ctk.CTkLabel(right_frame, text=f"Hạn thanh toán: {bill.get('dueDate', 'N/A')}", font=ctk.CTkFont(size=10)).pack(anchor="w")
        ctk.CTkLabel(right_frame, text=f"Chỉ số cũ: {bill.get('oldIndex', 'N/A')}", font=ctk.CTkFont(size=10)).pack(anchor="w")
        ctk.CTkLabel(right_frame, text=f"Chỉ số mới: {bill.get('newIndex', 'N/A')}", font=ctk.CTkFont(size=10)).pack(anchor="w")
        
        # Amount section
        amount_frame = ctk.CTkFrame(card_frame)
        amount_frame.pack(fill="x", padx=10, pady=5)
        
        amount_label = ctk.CTkLabel(
            amount_frame,
            text=f"💰 Số tiền: {bill.get('amount', 0):,.0f} VNĐ",
            font=ctk.CTkFont(size=16, weight="bold"),
            text_color="green"
        )
        amount_label.pack(side="left", pady=5)
        
        # Action buttons
        button_frame = ctk.CTkFrame(amount_frame)
        button_frame.pack(side="right", pady=5)
        
        pay_button = ctk.CTkButton(
            button_frame,
            text="💳 Thanh toán",
            command=lambda: self.pay_bill(result),
            width=120
        )
        pay_button.pack(side="left", padx=5)
        
        detail_button = ctk.CTkButton(
            button_frame,
            text="📋 Chi tiết",
            command=lambda: self.show_bill_detail(result),
            width=120
        )
        detail_button.pack(side="left", padx=5)
        
        # Source info
        source_label = ctk.CTkLabel(
            card_frame,
            text=f"📡 Nguồn: {result.get('source', 'unknown')}",
            font=ctk.CTkFont(size=8),
            text_color="gray"
        )
        source_label.pack(anchor="e", padx=10, pady=2)
    
    def pay_bill(self, result):
        """Chuyển sang tab thanh toán"""
        # Lưu thông tin hóa đơn
        self.app.selected_bill = result
        
        # Chuyển sang tab thanh toán
        self.app.tabview.set("💳 Thanh toán")
        
        # Cập nhật form thanh toán
        self.app.payment_frame.load_bill_data(result)
        
        self.app.show_message("Thành công", "Đã chuyển sang tab thanh toán", "success")
    
    def show_bill_detail(self, result):
        """Hiển thị chi tiết hóa đơn"""
        bill = result.get("bill", {})
        
        detail_window = ctk.CTkToplevel(self.app.root)
        detail_window.title("Chi tiết hóa đơn")
        detail_window.geometry("600x500")
        
        # Scroll frame
        scroll_frame = ctk.CTkScrollableFrame(detail_window, width=550, height=450)
        scroll_frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # Title
        title_label = ctk.CTkLabel(
            scroll_frame,
            text=f"CHI TIẾT HÓA ĐƠN: {bill.get('billNumber', 'N/A')}",
            font=ctk.CTkFont(size=16, weight="bold")
        )
        title_label.pack(pady=10)
        
        # Bill details
        details = [
            ("Mã hóa đơn", bill.get("billNumber", "N/A")),
            ("Loại hóa đơn", bill.get("billType", "N/A")),
            ("Nhà cung cấp", bill.get("provider", "N/A")),
            ("Kỳ thanh toán", bill.get("period", "N/A")),
            ("Hạn thanh toán", bill.get("dueDate", "N/A")),
            ("Trạng thái", bill.get("status", "N/A")),
            ("Chỉ số cũ", bill.get("oldIndex", "N/A")),
            ("Chỉ số mới", bill.get("newIndex", "N/A")),
            ("Tiêu thụ", bill.get("consumption", "N/A")),
            ("Thuế", f"{bill.get('taxes', 0):,.0f} VNĐ"),
            ("Phí", f"{bill.get('fees', 0):,.0f} VNĐ"),
            ("Tổng tiền", f"{bill.get('amount', 0):,.0f} VNĐ"),
            ("Mô tả", bill.get("description", "N/A"))
        ]
        
        for label, value in details:
            row_frame = ctk.CTkFrame(scroll_frame)
            row_frame.pack(fill="x", pady=2)
            
            ctk.CTkLabel(row_frame, text=f"{label}:", font=ctk.CTkFont(size=12, weight="bold"), width=150).pack(side="left", padx=10)
            ctk.CTkLabel(row_frame, text=str(value), font=ctk.CTkFont(size=12)).pack(side="left", padx=10)