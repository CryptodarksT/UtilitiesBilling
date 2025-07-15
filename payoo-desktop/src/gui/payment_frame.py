import customtkinter as ctk
from tkinter import ttk, messagebox
import threading
import json
from datetime import datetime
import webbrowser

class PaymentFrame:
    """Frame xử lý thanh toán"""
    
    def __init__(self, parent, app):
        self.parent = parent
        self.app = app
        self.selected_bill = None
        self.payment_method = "momo"
        self.create_ui()
    
    def create_ui(self):
        """Tạo giao diện thanh toán"""
        # Main container
        main_frame = ctk.CTkFrame(self.parent)
        main_frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # Title
        title_label = ctk.CTkLabel(
            main_frame,
            text="💳 THANH TOÁN HÓA ĐƠN",
            font=ctk.CTkFont(size=20, weight="bold")
        )
        title_label.pack(pady=10)
        
        # Content area
        content_frame = ctk.CTkFrame(main_frame)
        content_frame.pack(fill="both", expand=True, pady=10)
        
        # Left side - Bill info
        self.create_bill_info_section(content_frame)
        
        # Right side - Payment methods
        self.create_payment_methods_section(content_frame)
        
        # Bottom - Action buttons
        self.create_action_buttons(content_frame)
    
    def create_bill_info_section(self, parent):
        """Tạo phần thông tin hóa đơn"""
        left_frame = ctk.CTkFrame(parent)
        left_frame.pack(side="left", fill="both", expand=True, padx=10, pady=10)
        
        # Title
        bill_title = ctk.CTkLabel(
            left_frame,
            text="📋 THÔNG TIN HÓA ĐƠN",
            font=ctk.CTkFont(size=16, weight="bold")
        )
        bill_title.pack(pady=10)
        
        # Bill details container
        self.bill_details_frame = ctk.CTkScrollableFrame(left_frame, width=400, height=400)
        self.bill_details_frame.pack(fill="both", expand=True, padx=10, pady=10)
        
        # No bill selected message
        self.no_bill_label = ctk.CTkLabel(
            self.bill_details_frame,
            text="Chưa chọn hóa đơn\nVui lòng chọn hóa đơn từ tab 'Tra cứu hóa đơn'",
            font=ctk.CTkFont(size=12),
            text_color="gray"
        )
        self.no_bill_label.pack(pady=50)
    
    def create_payment_methods_section(self, parent):
        """Tạo phần chọn phương thức thanh toán"""
        right_frame = ctk.CTkFrame(parent)
        right_frame.pack(side="right", fill="both", expand=True, padx=10, pady=10)
        
        # Title
        payment_title = ctk.CTkLabel(
            right_frame,
            text="💰 PHƯƠNG THỨC THANH TOÁN",
            font=ctk.CTkFont(size=16, weight="bold")
        )
        payment_title.pack(pady=10)
        
        # Payment methods
        methods_frame = ctk.CTkFrame(right_frame)
        methods_frame.pack(fill="x", padx=10, pady=10)
        
        # MoMo
        momo_frame = ctk.CTkFrame(methods_frame)
        momo_frame.pack(fill="x", padx=10, pady=5)
        
        self.momo_radio = ctk.CTkRadioButton(
            momo_frame,
            text="",
            variable=ctk.StringVar(value="momo"),
            value="momo",
            command=lambda: self.select_payment_method("momo")
        )
        self.momo_radio.pack(side="left", padx=5)
        
        momo_info = ctk.CTkFrame(momo_frame)
        momo_info.pack(side="left", fill="x", expand=True, padx=5)
        
        ctk.CTkLabel(momo_info, text="💱 MoMo E-Wallet", font=ctk.CTkFont(size=14, weight="bold")).pack(anchor="w")
        ctk.CTkLabel(momo_info, text="Thanh toán qua ví điện tử MoMo", font=ctk.CTkFont(size=10)).pack(anchor="w")
        
        # BIDV
        bidv_frame = ctk.CTkFrame(methods_frame)
        bidv_frame.pack(fill="x", padx=10, pady=5)
        
        self.bidv_radio = ctk.CTkRadioButton(
            bidv_frame,
            text="",
            variable=ctk.StringVar(value="bidv"),
            value="bidv",
            command=lambda: self.select_payment_method("bidv")
        )
        self.bidv_radio.pack(side="left", padx=5)
        
        bidv_info = ctk.CTkFrame(bidv_frame)
        bidv_info.pack(side="left", fill="x", expand=True, padx=5)
        
        ctk.CTkLabel(bidv_info, text="🏦 BIDV Banking", font=ctk.CTkFont(size=14, weight="bold")).pack(anchor="w")
        ctk.CTkLabel(bidv_info, text="Thanh toán qua ngân hàng BIDV", font=ctk.CTkFont(size=10)).pack(anchor="w")
        
        # ZaloPay
        zalopay_frame = ctk.CTkFrame(methods_frame)
        zalopay_frame.pack(fill="x", padx=10, pady=5)
        
        self.zalopay_radio = ctk.CTkRadioButton(
            zalopay_frame,
            text="",
            variable=ctk.StringVar(value="zalopay"),
            value="zalopay",
            command=lambda: self.select_payment_method("zalopay")
        )
        self.zalopay_radio.pack(side="left", padx=5)
        
        zalopay_info = ctk.CTkFrame(zalopay_frame)
        zalopay_info.pack(side="left", fill="x", expand=True, padx=5)
        
        ctk.CTkLabel(zalopay_info, text="⚡ ZaloPay", font=ctk.CTkFont(size=14, weight="bold")).pack(anchor="w")
        ctk.CTkLabel(zalopay_info, text="Thanh toán qua ZaloPay", font=ctk.CTkFont(size=10)).pack(anchor="w")
        
        # Visa
        visa_frame = ctk.CTkFrame(methods_frame)
        visa_frame.pack(fill="x", padx=10, pady=5)
        
        self.visa_radio = ctk.CTkRadioButton(
            visa_frame,
            text="",
            variable=ctk.StringVar(value="visa"),
            value="visa",
            command=lambda: self.select_payment_method("visa")
        )
        self.visa_radio.pack(side="left", padx=5)
        
        visa_info = ctk.CTkFrame(visa_frame)
        visa_info.pack(side="left", fill="x", expand=True, padx=5)
        
        ctk.CTkLabel(visa_info, text="💳 Visa Direct", font=ctk.CTkFont(size=14, weight="bold")).pack(anchor="w")
        ctk.CTkLabel(visa_info, text="Thanh toán qua thẻ Visa", font=ctk.CTkFont(size=10)).pack(anchor="w")
        
        # Card input for Visa
        self.card_input_frame = ctk.CTkFrame(right_frame)
        self.card_input_frame.pack(fill="x", padx=10, pady=10)
        
        ctk.CTkLabel(self.card_input_frame, text="Số thẻ Visa:", font=ctk.CTkFont(size=12)).pack(anchor="w", pady=2)
        self.card_number_entry = ctk.CTkEntry(
            self.card_input_frame,
            placeholder_text="Nhập số thẻ Visa",
            width=300
        )
        self.card_number_entry.pack(fill="x", padx=5, pady=2)
        
        ctk.CTkLabel(self.card_input_frame, text="Tên chủ thẻ:", font=ctk.CTkFont(size=12)).pack(anchor="w", pady=2)
        self.card_holder_entry = ctk.CTkEntry(
            self.card_input_frame,
            placeholder_text="Nhập tên chủ thẻ",
            width=300
        )
        self.card_holder_entry.pack(fill="x", padx=5, pady=2)
        
        # Hide card input initially
        self.card_input_frame.pack_forget()
        
        # Set default selection
        self.momo_radio.select()
    
    def create_action_buttons(self, parent):
        """Tạo các nút hành động"""
        button_frame = ctk.CTkFrame(parent)
        button_frame.pack(fill="x", padx=10, pady=10)
        
        # Amount display
        self.amount_label = ctk.CTkLabel(
            button_frame,
            text="💰 Số tiền: 0 VNĐ",
            font=ctk.CTkFont(size=18, weight="bold"),
            text_color="green"
        )
        self.amount_label.pack(side="left", padx=10)
        
        # Buttons
        button_container = ctk.CTkFrame(button_frame)
        button_container.pack(side="right", padx=10)
        
        self.pay_button = ctk.CTkButton(
            button_container,
            text="💳 Thanh toán",
            command=self.process_payment,
            width=120,
            height=40,
            font=ctk.CTkFont(size=14, weight="bold")
        )
        self.pay_button.pack(side="left", padx=5)
        
        self.cancel_button = ctk.CTkButton(
            button_container,
            text="❌ Hủy",
            command=self.cancel_payment,
            width=120,
            height=40,
            fg_color="gray"
        )
        self.cancel_button.pack(side="left", padx=5)
        
        # Progress bar
        self.progress_bar = ctk.CTkProgressBar(button_frame, width=300)
        self.progress_bar.pack(pady=5)
        self.progress_bar.set(0)
        
        # Status label
        self.status_label = ctk.CTkLabel(button_frame, text="Sẵn sàng thanh toán", font=ctk.CTkFont(size=10))
        self.status_label.pack(pady=5)
    
    def select_payment_method(self, method):
        """Chọn phương thức thanh toán"""
        self.payment_method = method
        
        # Show/hide card input for Visa
        if method == "visa":
            self.card_input_frame.pack(fill="x", padx=10, pady=10)
        else:
            self.card_input_frame.pack_forget()
        
        print(f"Selected payment method: {method}")
    
    def load_bill_data(self, bill_result):
        """Tải thông tin hóa đơn"""
        self.selected_bill = bill_result
        
        # Clear previous content
        for widget in self.bill_details_frame.winfo_children():
            widget.destroy()
        
        if not bill_result or not bill_result.get("success"):
            self.no_bill_label = ctk.CTkLabel(
                self.bill_details_frame,
                text="Không có thông tin hóa đơn",
                font=ctk.CTkFont(size=12),
                text_color="red"
            )
            self.no_bill_label.pack(pady=50)
            return
        
        bill = bill_result.get("bill", {})
        customer = bill_result.get("customer", {})
        
        # Customer info
        customer_frame = ctk.CTkFrame(self.bill_details_frame)
        customer_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(customer_frame, text="👤 THÔNG TIN KHÁCH HÀNG", font=ctk.CTkFont(size=14, weight="bold")).pack(anchor="w", pady=5)
        
        customer_info = [
            ("Tên khách hàng", customer.get("name", "N/A")),
            ("Mã khách hàng", customer.get("id", "N/A")),
            ("Địa chỉ", customer.get("address", "N/A")),
            ("Điện thoại", customer.get("phone", "N/A")),
            ("Email", customer.get("email", "N/A"))
        ]
        
        for label, value in customer_info:
            info_frame = ctk.CTkFrame(customer_frame)
            info_frame.pack(fill="x", padx=5, pady=2)
            ctk.CTkLabel(info_frame, text=f"{label}:", font=ctk.CTkFont(size=10, weight="bold"), width=100).pack(side="left")
            ctk.CTkLabel(info_frame, text=str(value), font=ctk.CTkFont(size=10)).pack(side="left", padx=5)
        
        # Bill info
        bill_frame = ctk.CTkFrame(self.bill_details_frame)
        bill_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(bill_frame, text="📄 THÔNG TIN HÓA ĐƠN", font=ctk.CTkFont(size=14, weight="bold")).pack(anchor="w", pady=5)
        
        bill_info = [
            ("Mã hóa đơn", bill.get("billNumber", "N/A")),
            ("Loại hóa đơn", bill.get("billType", "N/A")),
            ("Nhà cung cấp", bill.get("provider", "N/A")),
            ("Kỳ thanh toán", bill.get("period", "N/A")),
            ("Hạn thanh toán", bill.get("dueDate", "N/A")),
            ("Trạng thái", bill.get("status", "N/A"))
        ]
        
        for label, value in bill_info:
            info_frame = ctk.CTkFrame(bill_frame)
            info_frame.pack(fill="x", padx=5, pady=2)
            ctk.CTkLabel(info_frame, text=f"{label}:", font=ctk.CTkFont(size=10, weight="bold"), width=100).pack(side="left")
            ctk.CTkLabel(info_frame, text=str(value), font=ctk.CTkFont(size=10)).pack(side="left", padx=5)
        
        # Usage info (for electric/water bills)
        if bill.get("oldIndex") or bill.get("newIndex"):
            usage_frame = ctk.CTkFrame(self.bill_details_frame)
            usage_frame.pack(fill="x", padx=10, pady=5)
            
            ctk.CTkLabel(usage_frame, text="📊 THÔNG TIN SỬ DỤNG", font=ctk.CTkFont(size=14, weight="bold")).pack(anchor="w", pady=5)
            
            usage_info = [
                ("Chỉ số cũ", bill.get("oldIndex", "N/A")),
                ("Chỉ số mới", bill.get("newIndex", "N/A")),
                ("Tiêu thụ", bill.get("consumption", "N/A")),
                ("Thuế", f"{bill.get('taxes', 0):,.0f} VNĐ"),
                ("Phí", f"{bill.get('fees', 0):,.0f} VNĐ")
            ]
            
            for label, value in usage_info:
                info_frame = ctk.CTkFrame(usage_frame)
                info_frame.pack(fill="x", padx=5, pady=2)
                ctk.CTkLabel(info_frame, text=f"{label}:", font=ctk.CTkFont(size=10, weight="bold"), width=100).pack(side="left")
                ctk.CTkLabel(info_frame, text=str(value), font=ctk.CTkFont(size=10)).pack(side="left", padx=5)
        
        # Amount
        amount = bill.get("amount", 0)
        self.amount_label.configure(text=f"💰 Số tiền: {amount:,.0f} VNĐ")
        
        # Description
        if bill.get("description"):
            desc_frame = ctk.CTkFrame(self.bill_details_frame)
            desc_frame.pack(fill="x", padx=10, pady=5)
            
            ctk.CTkLabel(desc_frame, text="📝 MÔ TẢ", font=ctk.CTkFont(size=14, weight="bold")).pack(anchor="w", pady=5)
            ctk.CTkLabel(desc_frame, text=bill.get("description", ""), font=ctk.CTkFont(size=10), wraplength=300).pack(anchor="w", padx=5)
    
    def process_payment(self):
        """Xử lý thanh toán"""
        if not self.selected_bill:
            self.app.show_message("Lỗi", "Vui lòng chọn hóa đơn để thanh toán", "error")
            return
        
        bill = self.selected_bill.get("bill", {})
        amount = bill.get("amount", 0)
        
        if amount <= 0:
            self.app.show_message("Lỗi", "Số tiền thanh toán không hợp lệ", "error")
            return
        
        # Validate Visa card input if selected
        if self.payment_method == "visa":
            card_number = self.card_number_entry.get().strip()
            card_holder = self.card_holder_entry.get().strip()
            
            if not card_number or not card_holder:
                self.app.show_message("Lỗi", "Vui lòng nhập đầy đủ thông tin thẻ Visa", "error")
                return
        
        # Start payment process
        thread = threading.Thread(target=self._process_payment_thread, args=(amount,))
        thread.start()
    
    def _process_payment_thread(self, amount):
        """Thread xử lý thanh toán"""
        try:
            # Update UI
            self.progress_bar.set(0.1)
            self.status_label.configure(text="Đang xử lý thanh toán...")
            self.pay_button.configure(state="disabled")
            
            # Process payment based on method
            if self.payment_method == "momo":
                self.progress_bar.set(0.3)
                result = self.process_momo_payment(amount)
            elif self.payment_method == "bidv":
                self.progress_bar.set(0.3)
                result = self.process_bidv_payment(amount)
            elif self.payment_method == "zalopay":
                self.progress_bar.set(0.3)
                result = self.process_zalopay_payment(amount)
            elif self.payment_method == "visa":
                self.progress_bar.set(0.3)
                result = self.process_visa_payment(amount)
            else:
                result = {"success": False, "message": "Phương thức thanh toán không hợp lệ"}
            
            self.progress_bar.set(0.8)
            
            # Handle result
            if result.get("success"):
                self.progress_bar.set(1.0)
                self.status_label.configure(text="Thanh toán thành công!")
                
                # Show success message
                self.app.show_message("Thành công", result.get("message", "Thanh toán thành công"), "success")
                
                # Open payment URL if available
                if result.get("pay_url"):
                    webbrowser.open(result["pay_url"])
                
                # Reset form
                self.reset_form()
                
            else:
                self.progress_bar.set(0)
                self.status_label.configure(text=f"Lỗi: {result.get('message', 'Thanh toán thất bại')}")
                self.app.show_message("Lỗi", result.get("message", "Thanh toán thất bại"), "error")
            
        except Exception as e:
            self.progress_bar.set(0)
            self.status_label.configure(text=f"Lỗi: {str(e)}")
            self.app.show_message("Lỗi", f"Có lỗi xảy ra: {str(e)}", "error")
        
        finally:
            self.pay_button.configure(state="normal")
    
    def process_momo_payment(self, amount):
        """Xử lý thanh toán MoMo"""
        try:
            bill = self.selected_bill.get("bill", {})
            order_info = f"Thanh toán hóa đơn {bill.get('billNumber', 'N/A')}"
            
            result = self.app.momo_service.create_payment(
                amount=int(amount),
                order_info=order_info,
                extra_data=json.dumps({"bill_id": bill.get("id", "")})
            )
            
            return result
        except Exception as e:
            return {"success": False, "message": f"Lỗi MoMo: {str(e)}"}
    
    def process_bidv_payment(self, amount):
        """Xử lý thanh toán BIDV"""
        try:
            # BIDV payment simulation
            return {
                "success": True,
                "message": "Đã tạo yêu cầu thanh toán BIDV",
                "pay_url": "https://bidv.com.vn/payment/simulate"
            }
        except Exception as e:
            return {"success": False, "message": f"Lỗi BIDV: {str(e)}"}
    
    def process_zalopay_payment(self, amount):
        """Xử lý thanh toán ZaloPay"""
        try:
            bill = self.selected_bill.get("bill", {})
            customer = self.selected_bill.get("customer", {})
            
            description = f"Thanh toán hóa đơn {bill.get('billNumber', 'N/A')}"
            user_info = {
                "name": customer.get("name", "Customer"),
                "phone": customer.get("phone", ""),
                "email": customer.get("email", "")
            }
            
            result = self.app.zalopay_service.create_order(
                amount=int(amount),
                description=description,
                user_info=user_info
            )
            
            if result.get("success"):
                result["pay_url"] = result.get("order_url")
            
            return result
        except Exception as e:
            return {"success": False, "message": f"Lỗi ZaloPay: {str(e)}"}
    
    def process_visa_payment(self, amount):
        """Xử lý thanh toán Visa"""
        try:
            card_number = self.card_number_entry.get().strip()
            card_holder = self.card_holder_entry.get().strip()
            customer = self.selected_bill.get("customer", {})
            
            result = self.app.visa_service.funds_transfer(
                amount=float(amount),
                card_number=card_number,
                recipient_name=card_holder,
                recipient_address=customer.get("address", ""),
                currency="VND"
            )
            
            return result
        except Exception as e:
            return {"success": False, "message": f"Lỗi Visa: {str(e)}"}
    
    def cancel_payment(self):
        """Hủy thanh toán"""
        self.reset_form()
        self.app.show_message("Thông báo", "Đã hủy thanh toán", "info")
    
    def reset_form(self):
        """Reset form thanh toán"""
        self.selected_bill = None
        self.progress_bar.set(0)
        self.status_label.configure(text="Sẵn sàng thanh toán")
        self.amount_label.configure(text="💰 Số tiền: 0 VNĐ")
        self.card_number_entry.delete(0, "end")
        self.card_holder_entry.delete(0, "end")
        
        # Clear bill details
        for widget in self.bill_details_frame.winfo_children():
            widget.destroy()
        
        self.no_bill_label = ctk.CTkLabel(
            self.bill_details_frame,
            text="Chưa chọn hóa đơn\nVui lòng chọn hóa đơn từ tab 'Tra cứu hóa đơn'",
            font=ctk.CTkFont(size=12),
            text_color="gray"
        )
        self.no_bill_label.pack(pady=50)