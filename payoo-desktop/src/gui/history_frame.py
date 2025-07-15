import customtkinter as ctk
from tkinter import ttk, messagebox, filedialog
import json
import threading
from datetime import datetime, timedelta

class HistoryFrame:
    """Frame lịch sử giao dịch"""
    
    def __init__(self, parent, app):
        self.parent = parent
        self.app = app
        self.history_data = []
        self.create_ui()
        self.load_history()
    
    def create_ui(self):
        """Tạo giao diện lịch sử"""
        # Main container
        main_frame = ctk.CTkFrame(self.parent)
        main_frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # Title
        title_label = ctk.CTkLabel(
            main_frame,
            text="📋 LỊCH SỬ GIAO DỊCH",
            font=ctk.CTkFont(size=20, weight="bold")
        )
        title_label.pack(pady=10)
        
        # Controls frame
        self.create_controls(main_frame)
        
        # History table
        self.create_history_table(main_frame)
        
        # Summary frame
        self.create_summary(main_frame)
    
    def create_controls(self, parent):
        """Tạo các controls filter và action"""
        controls_frame = ctk.CTkFrame(parent)
        controls_frame.pack(fill="x", pady=10)
        
        # Filter frame
        filter_frame = ctk.CTkFrame(controls_frame)
        filter_frame.pack(fill="x", padx=10, pady=5)
        
        # Date range
        date_frame = ctk.CTkFrame(filter_frame)
        date_frame.pack(side="left", padx=5)
        
        ctk.CTkLabel(date_frame, text="Từ ngày:", font=ctk.CTkFont(size=12)).pack(side="left", padx=5)
        self.start_date_entry = ctk.CTkEntry(date_frame, width=120, placeholder_text="yyyy-mm-dd")
        self.start_date_entry.pack(side="left", padx=5)
        
        ctk.CTkLabel(date_frame, text="Đến ngày:", font=ctk.CTkFont(size=12)).pack(side="left", padx=5)
        self.end_date_entry = ctk.CTkEntry(date_frame, width=120, placeholder_text="yyyy-mm-dd")
        self.end_date_entry.pack(side="left", padx=5)
        
        # Status filter
        status_frame = ctk.CTkFrame(filter_frame)
        status_frame.pack(side="left", padx=5)
        
        ctk.CTkLabel(status_frame, text="Trạng thái:", font=ctk.CTkFont(size=12)).pack(side="left", padx=5)
        self.status_combo = ctk.CTkComboBox(
            status_frame,
            values=["Tất cả", "Thành công", "Thất bại", "Đang xử lý"],
            width=120
        )
        self.status_combo.pack(side="left", padx=5)
        self.status_combo.set("Tất cả")
        
        # Payment method filter
        method_frame = ctk.CTkFrame(filter_frame)
        method_frame.pack(side="left", padx=5)
        
        ctk.CTkLabel(method_frame, text="Phương thức:", font=ctk.CTkFont(size=12)).pack(side="left", padx=5)
        self.method_combo = ctk.CTkComboBox(
            method_frame,
            values=["Tất cả", "MoMo", "BIDV", "ZaloPay", "Visa"],
            width=120
        )
        self.method_combo.pack(side="left", padx=5)
        self.method_combo.set("Tất cả")
        
        # Action buttons
        action_frame = ctk.CTkFrame(controls_frame)
        action_frame.pack(fill="x", padx=10, pady=5)
        
        # Left side buttons
        left_buttons = ctk.CTkFrame(action_frame)
        left_buttons.pack(side="left")
        
        ctk.CTkButton(left_buttons, text="🔍 Tìm kiếm", command=self.filter_history, width=100).pack(side="left", padx=5)
        ctk.CTkButton(left_buttons, text="🔄 Làm mới", command=self.refresh_history, width=100).pack(side="left", padx=5)
        ctk.CTkButton(left_buttons, text="🗑️ Xóa lọc", command=self.clear_filters, width=100).pack(side="left", padx=5)
        
        # Right side buttons
        right_buttons = ctk.CTkFrame(action_frame)
        right_buttons.pack(side="right")
        
        ctk.CTkButton(right_buttons, text="📊 Báo cáo", command=self.generate_report, width=100).pack(side="left", padx=5)
        ctk.CTkButton(right_buttons, text="💾 Xuất Excel", command=self.export_excel, width=100).pack(side="left", padx=5)
        ctk.CTkButton(right_buttons, text="🗂️ Backup", command=self.backup_history, width=100).pack(side="left", padx=5)
    
    def create_history_table(self, parent):
        """Tạo bảng lịch sử giao dịch"""
        table_frame = ctk.CTkFrame(parent)
        table_frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        # Table header
        header_frame = ctk.CTkFrame(table_frame)
        header_frame.pack(fill="x", padx=5, pady=5)
        
        headers = [
            ("Mã GD", 120),
            ("Ngày", 100),
            ("Khách hàng", 150),
            ("Loại HĐ", 80),
            ("Số tiền", 100),
            ("Phương thức", 100),
            ("Trạng thái", 100),
            ("Hành động", 100)
        ]
        
        for header, width in headers:
            ctk.CTkLabel(
                header_frame,
                text=header,
                font=ctk.CTkFont(size=12, weight="bold"),
                width=width
            ).pack(side="left", padx=2)
        
        # Scrollable table content
        self.table_scroll = ctk.CTkScrollableFrame(table_frame, width=800, height=400)
        self.table_scroll.pack(fill="both", expand=True, padx=5, pady=5)
        
        # No data message
        self.no_data_label = ctk.CTkLabel(
            self.table_scroll,
            text="Chưa có dữ liệu lịch sử giao dịch",
            font=ctk.CTkFont(size=14),
            text_color="gray"
        )
        self.no_data_label.pack(pady=50)
    
    def create_summary(self, parent):
        """Tạo phần tổng kết"""
        summary_frame = ctk.CTkFrame(parent)
        summary_frame.pack(fill="x", padx=10, pady=10)
        
        # Summary title
        ctk.CTkLabel(
            summary_frame,
            text="📊 THỐNG KÊ TỔNG KẾT",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(pady=5)
        
        # Summary cards
        cards_frame = ctk.CTkFrame(summary_frame)
        cards_frame.pack(fill="x", padx=10, pady=5)
        
        # Total transactions
        total_card = ctk.CTkFrame(cards_frame)
        total_card.pack(side="left", fill="x", expand=True, padx=5)
        
        ctk.CTkLabel(total_card, text="Tổng giao dịch", font=ctk.CTkFont(size=12)).pack(pady=2)
        self.total_count_label = ctk.CTkLabel(total_card, text="0", font=ctk.CTkFont(size=20, weight="bold"))
        self.total_count_label.pack(pady=2)
        
        # Total amount
        amount_card = ctk.CTkFrame(cards_frame)
        amount_card.pack(side="left", fill="x", expand=True, padx=5)
        
        ctk.CTkLabel(amount_card, text="Tổng tiền", font=ctk.CTkFont(size=12)).pack(pady=2)
        self.total_amount_label = ctk.CTkLabel(amount_card, text="0 VNĐ", font=ctk.CTkFont(size=20, weight="bold"), text_color="green")
        self.total_amount_label.pack(pady=2)
        
        # Success rate
        success_card = ctk.CTkFrame(cards_frame)
        success_card.pack(side="left", fill="x", expand=True, padx=5)
        
        ctk.CTkLabel(success_card, text="Tỷ lệ thành công", font=ctk.CTkFont(size=12)).pack(pady=2)
        self.success_rate_label = ctk.CTkLabel(success_card, text="0%", font=ctk.CTkFont(size=20, weight="bold"), text_color="blue")
        self.success_rate_label.pack(pady=2)
        
        # Today's transactions
        today_card = ctk.CTkFrame(cards_frame)
        today_card.pack(side="left", fill="x", expand=True, padx=5)
        
        ctk.CTkLabel(today_card, text="Hôm nay", font=ctk.CTkFont(size=12)).pack(pady=2)
        self.today_count_label = ctk.CTkLabel(today_card, text="0", font=ctk.CTkFont(size=20, weight="bold"), text_color="orange")
        self.today_count_label.pack(pady=2)
    
    def load_history(self):
        """Tải lịch sử giao dịch"""
        # Simulate loading history data
        self.history_data = self.generate_sample_history()
        self.display_history()
        self.update_summary()
    
    def generate_sample_history(self):
        """Tạo dữ liệu mẫu cho lịch sử"""
        import random
        
        sample_data = []
        for i in range(50):
            date = datetime.now() - timedelta(days=random.randint(0, 30))
            
            transaction = {
                "transaction_id": f"TX{random.randint(100000, 999999)}",
                "date": date.strftime("%Y-%m-%d %H:%M"),
                "customer_name": random.choice(["Nguyễn Văn An", "Trần Thị Bình", "Lê Minh Cường", "Phạm Thị Dung"]),
                "customer_id": f"CUST{random.randint(1000, 9999)}",
                "bill_type": random.choice(["Điện", "Nước", "Internet", "TV"]),
                "amount": random.randint(100000, 1000000),
                "payment_method": random.choice(["MoMo", "BIDV", "ZaloPay", "Visa"]),
                "status": random.choice(["Thành công", "Thất bại", "Đang xử lý"]),
                "provider": random.choice(["EVN", "SAWACO", "VNPT", "K+"]),
                "bill_number": f"HD{random.randint(10000, 99999)}",
                "description": f"Thanh toán hóa đơn {random.choice(['điện', 'nước', 'internet', 'TV'])}"
            }
            sample_data.append(transaction)
        
        return sample_data
    
    def display_history(self, data=None):
        """Hiển thị lịch sử giao dịch"""
        if data is None:
            data = self.history_data
        
        # Clear existing data
        for widget in self.table_scroll.winfo_children():
            widget.destroy()
        
        if not data:
            self.no_data_label = ctk.CTkLabel(
                self.table_scroll,
                text="Không có dữ liệu phù hợp với bộ lọc",
                font=ctk.CTkFont(size=14),
                text_color="gray"
            )
            self.no_data_label.pack(pady=50)
            return
        
        # Display transactions
        for transaction in data:
            self.create_transaction_row(transaction)
    
    def create_transaction_row(self, transaction):
        """Tạo một dòng giao dịch"""
        row_frame = ctk.CTkFrame(self.table_scroll)
        row_frame.pack(fill="x", padx=5, pady=2)
        
        # Transaction ID
        ctk.CTkLabel(
            row_frame,
            text=transaction["transaction_id"],
            font=ctk.CTkFont(size=10),
            width=120
        ).pack(side="left", padx=2)
        
        # Date
        ctk.CTkLabel(
            row_frame,
            text=transaction["date"],
            font=ctk.CTkFont(size=10),
            width=100
        ).pack(side="left", padx=2)
        
        # Customer
        ctk.CTkLabel(
            row_frame,
            text=transaction["customer_name"],
            font=ctk.CTkFont(size=10),
            width=150
        ).pack(side="left", padx=2)
        
        # Bill type
        ctk.CTkLabel(
            row_frame,
            text=transaction["bill_type"],
            font=ctk.CTkFont(size=10),
            width=80
        ).pack(side="left", padx=2)
        
        # Amount
        ctk.CTkLabel(
            row_frame,
            text=f"{transaction['amount']:,.0f}",
            font=ctk.CTkFont(size=10, weight="bold"),
            text_color="green",
            width=100
        ).pack(side="left", padx=2)
        
        # Payment method
        ctk.CTkLabel(
            row_frame,
            text=transaction["payment_method"],
            font=ctk.CTkFont(size=10),
            width=100
        ).pack(side="left", padx=2)
        
        # Status
        status_color = "green" if transaction["status"] == "Thành công" else "red" if transaction["status"] == "Thất bại" else "orange"
        ctk.CTkLabel(
            row_frame,
            text=transaction["status"],
            font=ctk.CTkFont(size=10, weight="bold"),
            text_color=status_color,
            width=100
        ).pack(side="left", padx=2)
        
        # Actions
        action_frame = ctk.CTkFrame(row_frame)
        action_frame.pack(side="left", padx=2)
        
        ctk.CTkButton(
            action_frame,
            text="👁️",
            command=lambda t=transaction: self.view_transaction_detail(t),
            width=30,
            height=20
        ).pack(side="left", padx=1)
        
        ctk.CTkButton(
            action_frame,
            text="📄",
            command=lambda t=transaction: self.print_receipt(t),
            width=30,
            height=20
        ).pack(side="left", padx=1)
    
    def filter_history(self):
        """Lọc lịch sử theo điều kiện"""
        filtered_data = self.history_data.copy()
        
        # Filter by date range
        start_date = self.start_date_entry.get().strip()
        end_date = self.end_date_entry.get().strip()
        
        if start_date or end_date:
            filtered_data = [t for t in filtered_data if self.date_in_range(t["date"], start_date, end_date)]
        
        # Filter by status
        status = self.status_combo.get()
        if status != "Tất cả":
            filtered_data = [t for t in filtered_data if t["status"] == status]
        
        # Filter by payment method
        method = self.method_combo.get()
        if method != "Tất cả":
            filtered_data = [t for t in filtered_data if t["payment_method"] == method]
        
        self.display_history(filtered_data)
        self.update_summary(filtered_data)
    
    def date_in_range(self, date_str, start_date, end_date):
        """Kiểm tra ngày có trong khoảng không"""
        try:
            date = datetime.strptime(date_str, "%Y-%m-%d %H:%M").date()
            
            if start_date:
                start = datetime.strptime(start_date, "%Y-%m-%d").date()
                if date < start:
                    return False
            
            if end_date:
                end = datetime.strptime(end_date, "%Y-%m-%d").date()
                if date > end:
                    return False
            
            return True
        except:
            return True
    
    def refresh_history(self):
        """Làm mới lịch sử"""
        self.load_history()
        self.app.show_message("Thành công", "Đã làm mới lịch sử giao dịch", "success")
    
    def clear_filters(self):
        """Xóa tất cả bộ lọc"""
        self.start_date_entry.delete(0, "end")
        self.end_date_entry.delete(0, "end")
        self.status_combo.set("Tất cả")
        self.method_combo.set("Tất cả")
        self.display_history()
        self.update_summary()
    
    def update_summary(self, data=None):
        """Cập nhật thống kê tổng kết"""
        if data is None:
            data = self.history_data
        
        total_count = len(data)
        total_amount = sum(t["amount"] for t in data)
        success_count = len([t for t in data if t["status"] == "Thành công"])
        success_rate = (success_count / total_count * 100) if total_count > 0 else 0
        
        today = datetime.now().date()
        today_count = len([t for t in data if datetime.strptime(t["date"], "%Y-%m-%d %H:%M").date() == today])
        
        self.total_count_label.configure(text=str(total_count))
        self.total_amount_label.configure(text=f"{total_amount:,.0f} VNĐ")
        self.success_rate_label.configure(text=f"{success_rate:.1f}%")
        self.today_count_label.configure(text=str(today_count))
    
    def view_transaction_detail(self, transaction):
        """Xem chi tiết giao dịch"""
        detail_window = ctk.CTkToplevel(self.app.root)
        detail_window.title("Chi tiết giao dịch")
        detail_window.geometry("600x500")
        
        # Scroll frame
        scroll_frame = ctk.CTkScrollableFrame(detail_window, width=550, height=450)
        scroll_frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # Title
        title_label = ctk.CTkLabel(
            scroll_frame,
            text=f"CHI TIẾT GIAO DỊCH: {transaction['transaction_id']}",
            font=ctk.CTkFont(size=16, weight="bold")
        )
        title_label.pack(pady=10)
        
        # Transaction details
        details = [
            ("Mã giao dịch", transaction["transaction_id"]),
            ("Ngày giao dịch", transaction["date"]),
            ("Tên khách hàng", transaction["customer_name"]),
            ("Mã khách hàng", transaction["customer_id"]),
            ("Loại hóa đơn", transaction["bill_type"]),
            ("Nhà cung cấp", transaction["provider"]),
            ("Mã hóa đơn", transaction["bill_number"]),
            ("Số tiền", f"{transaction['amount']:,.0f} VNĐ"),
            ("Phương thức thanh toán", transaction["payment_method"]),
            ("Trạng thái", transaction["status"]),
            ("Mô tả", transaction["description"])
        ]
        
        for label, value in details:
            row_frame = ctk.CTkFrame(scroll_frame)
            row_frame.pack(fill="x", pady=3)
            
            ctk.CTkLabel(
                row_frame,
                text=f"{label}:",
                font=ctk.CTkFont(size=12, weight="bold"),
                width=150
            ).pack(side="left", padx=10)
            
            ctk.CTkLabel(
                row_frame,
                text=str(value),
                font=ctk.CTkFont(size=12)
            ).pack(side="left", padx=10)
        
        # Action buttons
        button_frame = ctk.CTkFrame(scroll_frame)
        button_frame.pack(fill="x", pady=20)
        
        ctk.CTkButton(
            button_frame,
            text="📄 In hóa đơn",
            command=lambda: self.print_receipt(transaction)
        ).pack(side="left", padx=10)
        
        ctk.CTkButton(
            button_frame,
            text="❌ Đóng",
            command=detail_window.destroy
        ).pack(side="right", padx=10)
    
    def print_receipt(self, transaction):
        """In hóa đơn"""
        self.app.show_message("Thông báo", f"Đã gửi hóa đơn {transaction['transaction_id']} đến máy in", "info")
    
    def generate_report(self):
        """Tạo báo cáo"""
        try:
            result = self.app.excel_processor.create_payment_report(
                self.history_data,
                start_date=self.start_date_entry.get(),
                end_date=self.end_date_entry.get()
            )
            
            if result["success"]:
                self.app.show_message("Thành công", f"Đã tạo báo cáo: {result['file_path']}", "success")
            else:
                self.app.show_message("Lỗi", result["message"], "error")
        except Exception as e:
            self.app.show_message("Lỗi", f"Lỗi tạo báo cáo: {str(e)}", "error")
    
    def export_excel(self):
        """Xuất Excel"""
        file_path = filedialog.asksaveasfilename(
            title="Xuất Excel",
            defaultextension=".xlsx",
            filetypes=[("Excel files", "*.xlsx"), ("All files", "*.*")]
        )
        
        if file_path:
            try:
                result = self.app.excel_processor.export_payment_history(
                    self.history_data,
                    file_path
                )
                
                if result["success"]:
                    self.app.show_message("Thành công", f"Đã xuất {result['total_records']} bản ghi", "success")
                else:
                    self.app.show_message("Lỗi", result["message"], "error")
            except Exception as e:
                self.app.show_message("Lỗi", f"Lỗi xuất Excel: {str(e)}", "error")
    
    def backup_history(self):
        """Backup lịch sử"""
        backup_dir = filedialog.askdirectory(title="Chọn thư mục backup")
        
        if backup_dir:
            try:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                backup_file = f"{backup_dir}/history_backup_{timestamp}.json"
                
                with open(backup_file, 'w', encoding='utf-8') as f:
                    json.dump(self.history_data, f, indent=2, ensure_ascii=False)
                
                self.app.show_message("Thành công", f"Đã backup lịch sử: {backup_file}", "success")
            except Exception as e:
                self.app.show_message("Lỗi", f"Lỗi backup: {str(e)}", "error")