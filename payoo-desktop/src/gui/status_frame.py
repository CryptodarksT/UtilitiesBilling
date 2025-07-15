import customtkinter as ctk
from tkinter import ttk, messagebox
import threading
import time
import json
from datetime import datetime, timedelta

class StatusFrame:
    """Frame theo dõi trạng thái API"""
    
    def __init__(self, parent, app):
        self.parent = parent
        self.app = app
        self.api_status = {}
        self.monitoring_active = False
        self.create_ui()
        self.start_monitoring()
    
    def create_ui(self):
        """Tạo giao diện trạng thái"""
        # Main container
        main_frame = ctk.CTkFrame(self.parent)
        main_frame.pack(fill="both", expand=True, padx=20, pady=20)
        
        # Title
        title_label = ctk.CTkLabel(
            main_frame,
            text="📊 TRẠNG THÁI API",
            font=ctk.CTkFont(size=20, weight="bold")
        )
        title_label.pack(pady=10)
        
        # Control buttons
        self.create_control_buttons(main_frame)
        
        # Status overview
        self.create_status_overview(main_frame)
        
        # API status cards
        self.create_api_status_cards(main_frame)
        
        # Metrics and charts
        self.create_metrics_section(main_frame)
        
        # Logs section
        self.create_logs_section(main_frame)
    
    def create_control_buttons(self, parent):
        """Tạo các nút điều khiển"""
        control_frame = ctk.CTkFrame(parent)
        control_frame.pack(fill="x", pady=10)
        
        # Left side - Status controls
        left_frame = ctk.CTkFrame(control_frame)
        left_frame.pack(side="left", padx=10)
        
        self.monitoring_button = ctk.CTkButton(
            left_frame,
            text="⏸️ Dừng monitor",
            command=self.toggle_monitoring,
            width=120
        )
        self.monitoring_button.pack(side="left", padx=5)
        
        refresh_button = ctk.CTkButton(
            left_frame,
            text="🔄 Làm mới",
            command=self.refresh_status,
            width=120
        )
        refresh_button.pack(side="left", padx=5)
        
        # Right side - Actions
        right_frame = ctk.CTkFrame(control_frame)
        right_frame.pack(side="right", padx=10)
        
        test_all_button = ctk.CTkButton(
            right_frame,
            text="🧪 Test tất cả",
            command=self.test_all_apis,
            width=120
        )
        test_all_button.pack(side="left", padx=5)
        
        export_button = ctk.CTkButton(
            right_frame,
            text="📊 Xuất báo cáo",
            command=self.export_report,
            width=120
        )
        export_button.pack(side="left", padx=5)
        
        # Auto refresh
        auto_refresh_frame = ctk.CTkFrame(control_frame)
        auto_refresh_frame.pack(padx=10)
        
        ctk.CTkLabel(auto_refresh_frame, text="Auto refresh:", font=ctk.CTkFont(size=12)).pack(side="left", padx=5)
        self.auto_refresh_combo = ctk.CTkComboBox(
            auto_refresh_frame,
            values=["5s", "10s", "30s", "1m", "5m"],
            width=80
        )
        self.auto_refresh_combo.pack(side="left", padx=5)
        self.auto_refresh_combo.set("10s")
    
    def create_status_overview(self, parent):
        """Tạo phần tổng quan trạng thái"""
        overview_frame = ctk.CTkFrame(parent)
        overview_frame.pack(fill="x", pady=10)
        
        # Overall status
        overall_frame = ctk.CTkFrame(overview_frame)
        overall_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(
            overall_frame,
            text="🌐 TRẠNG THÁI TỔNG QUAN",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(side="left", padx=10)
        
        self.overall_status_label = ctk.CTkLabel(
            overall_frame,
            text="🟢 Tất cả hoạt động tốt",
            font=ctk.CTkFont(size=14, weight="bold"),
            text_color="green"
        )
        self.overall_status_label.pack(side="right", padx=10)
        
        # Summary stats
        stats_frame = ctk.CTkFrame(overview_frame)
        stats_frame.pack(fill="x", padx=10, pady=5)
        
        # Active APIs
        active_frame = ctk.CTkFrame(stats_frame)
        active_frame.pack(side="left", fill="x", expand=True, padx=5)
        
        ctk.CTkLabel(active_frame, text="APIs hoạt động", font=ctk.CTkFont(size=12)).pack(pady=2)
        self.active_apis_label = ctk.CTkLabel(active_frame, text="0/4", font=ctk.CTkFont(size=20, weight="bold"), text_color="green")
        self.active_apis_label.pack(pady=2)
        
        # Average response time
        response_frame = ctk.CTkFrame(stats_frame)
        response_frame.pack(side="left", fill="x", expand=True, padx=5)
        
        ctk.CTkLabel(response_frame, text="Thời gian phản hồi TB", font=ctk.CTkFont(size=12)).pack(pady=2)
        self.avg_response_label = ctk.CTkLabel(response_frame, text="0ms", font=ctk.CTkFont(size=20, weight="bold"), text_color="blue")
        self.avg_response_label.pack(pady=2)
        
        # Uptime
        uptime_frame = ctk.CTkFrame(stats_frame)
        uptime_frame.pack(side="left", fill="x", expand=True, padx=5)
        
        ctk.CTkLabel(uptime_frame, text="Uptime TB", font=ctk.CTkFont(size=12)).pack(pady=2)
        self.uptime_label = ctk.CTkLabel(uptime_frame, text="0%", font=ctk.CTkFont(size=20, weight="bold"), text_color="purple")
        self.uptime_label.pack(pady=2)
        
        # Last updated
        updated_frame = ctk.CTkFrame(stats_frame)
        updated_frame.pack(side="left", fill="x", expand=True, padx=5)
        
        ctk.CTkLabel(updated_frame, text="Cập nhật lần cuối", font=ctk.CTkFont(size=12)).pack(pady=2)
        self.last_updated_label = ctk.CTkLabel(updated_frame, text="--:--:--", font=ctk.CTkFont(size=20, weight="bold"), text_color="orange")
        self.last_updated_label.pack(pady=2)
    
    def create_api_status_cards(self, parent):
        """Tạo các card trạng thái API"""
        cards_frame = ctk.CTkFrame(parent)
        cards_frame.pack(fill="x", pady=10)
        
        # Cards container
        cards_container = ctk.CTkFrame(cards_frame)
        cards_container.pack(fill="x", padx=10, pady=10)
        
        # API providers
        self.api_cards = {}
        providers = [
            {
                "name": "MoMo Business",
                "key": "momo",
                "icon": "💱",
                "description": "Ví điện tử MoMo"
            },
            {
                "name": "BIDV Banking",
                "key": "bidv",
                "icon": "🏦",
                "description": "Ngân hàng BIDV"
            },
            {
                "name": "ZaloPay",
                "key": "zalopay",
                "icon": "⚡",
                "description": "Ví điện tử ZaloPay"
            },
            {
                "name": "Visa Direct",
                "key": "visa",
                "icon": "💳",
                "description": "Thanh toán thẻ Visa"
            }
        ]
        
        for i, provider in enumerate(providers):
            # Card frame
            card_frame = ctk.CTkFrame(cards_container)
            if i < 2:  # First row
                card_frame.pack(side="left", fill="x", expand=True, padx=5, pady=5)
            else:  # Second row
                if i == 2:
                    second_row = ctk.CTkFrame(cards_container)
                    second_row.pack(fill="x", pady=5)
                card_frame = ctk.CTkFrame(second_row)
                card_frame.pack(side="left", fill="x", expand=True, padx=5)
            
            # Header
            header_frame = ctk.CTkFrame(card_frame)
            header_frame.pack(fill="x", padx=10, pady=5)
            
            ctk.CTkLabel(
                header_frame,
                text=f"{provider['icon']} {provider['name']}",
                font=ctk.CTkFont(size=14, weight="bold")
            ).pack(side="left")
            
            # Status indicator
            status_label = ctk.CTkLabel(
                header_frame,
                text="🔴 Offline",
                font=ctk.CTkFont(size=12, weight="bold"),
                text_color="red"
            )
            status_label.pack(side="right")
            
            # Details
            details_frame = ctk.CTkFrame(card_frame)
            details_frame.pack(fill="x", padx=10, pady=5)
            
            # Response time
            response_label = ctk.CTkLabel(
                details_frame,
                text="Response: --ms",
                font=ctk.CTkFont(size=10)
            )
            response_label.pack(anchor="w")
            
            # Uptime
            uptime_label = ctk.CTkLabel(
                details_frame,
                text="Uptime: --%",
                font=ctk.CTkFont(size=10)
            )
            uptime_label.pack(anchor="w")
            
            # Last check
            last_check_label = ctk.CTkLabel(
                details_frame,
                text="Last check: --:--:--",
                font=ctk.CTkFont(size=10)
            )
            last_check_label.pack(anchor="w")
            
            # Actions
            actions_frame = ctk.CTkFrame(card_frame)
            actions_frame.pack(fill="x", padx=10, pady=5)
            
            test_button = ctk.CTkButton(
                actions_frame,
                text="🧪 Test",
                command=lambda p=provider['key']: self.test_single_api(p),
                width=60,
                height=25
            )
            test_button.pack(side="left", padx=2)
            
            config_button = ctk.CTkButton(
                actions_frame,
                text="⚙️ Config",
                command=lambda p=provider['key']: self.open_api_config(p),
                width=60,
                height=25
            )
            config_button.pack(side="left", padx=2)
            
            # Store references
            self.api_cards[provider['key']] = {
                'status_label': status_label,
                'response_label': response_label,
                'uptime_label': uptime_label,
                'last_check_label': last_check_label,
                'test_button': test_button,
                'config_button': config_button
            }
    
    def create_metrics_section(self, parent):
        """Tạo phần metrics và biểu đồ"""
        metrics_frame = ctk.CTkFrame(parent)
        metrics_frame.pack(fill="both", expand=True, pady=10)
        
        # Metrics title
        ctk.CTkLabel(
            metrics_frame,
            text="📈 METRICS & BIỂU ĐỒ",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(pady=5)
        
        # Metrics container
        metrics_container = ctk.CTkFrame(metrics_frame)
        metrics_container.pack(fill="both", expand=True, padx=10, pady=5)
        
        # Response time chart (simulated)
        chart_frame = ctk.CTkFrame(metrics_container)
        chart_frame.pack(side="left", fill="both", expand=True, padx=5)
        
        ctk.CTkLabel(chart_frame, text="📊 Response Time (24h)", font=ctk.CTkFont(size=12, weight="bold")).pack(pady=5)
        
        # Simulated chart data
        self.chart_text = ctk.CTkTextbox(chart_frame, width=400, height=150)
        self.chart_text.pack(fill="both", expand=True, padx=5, pady=5)
        
        # Current metrics
        current_metrics_frame = ctk.CTkFrame(metrics_container)
        current_metrics_frame.pack(side="right", fill="y", padx=5)
        
        ctk.CTkLabel(current_metrics_frame, text="📋 Current Metrics", font=ctk.CTkFont(size=12, weight="bold")).pack(pady=5)
        
        self.metrics_text = ctk.CTkTextbox(current_metrics_frame, width=300, height=150)
        self.metrics_text.pack(fill="both", expand=True, padx=5, pady=5)
        
        # Update chart
        self.update_chart()
    
    def create_logs_section(self, parent):
        """Tạo phần logs"""
        logs_frame = ctk.CTkFrame(parent)
        logs_frame.pack(fill="x", pady=10)
        
        # Logs title
        logs_title_frame = ctk.CTkFrame(logs_frame)
        logs_title_frame.pack(fill="x", padx=10, pady=5)
        
        ctk.CTkLabel(
            logs_title_frame,
            text="📋 API LOGS",
            font=ctk.CTkFont(size=16, weight="bold")
        ).pack(side="left")
        
        # Clear logs button
        clear_button = ctk.CTkButton(
            logs_title_frame,
            text="🗑️ Clear",
            command=self.clear_logs,
            width=80
        )
        clear_button.pack(side="right", padx=5)
        
        # Logs content
        self.logs_text = ctk.CTkTextbox(logs_frame, width=800, height=150)
        self.logs_text.pack(fill="x", padx=10, pady=5)
        
        # Add initial logs
        self.add_log("System started - API monitoring initialized")
    
    def start_monitoring(self):
        """Bắt đầu monitoring"""
        self.monitoring_active = True
        self.monitoring_thread = threading.Thread(target=self.monitoring_loop, daemon=True)
        self.monitoring_thread.start()
    
    def monitoring_loop(self):
        """Vòng lặp monitoring"""
        while self.monitoring_active:
            try:
                # Get refresh interval
                refresh_interval = self.get_refresh_interval()
                
                # Update API status
                self.update_api_status()
                
                # Sleep for refresh interval
                time.sleep(refresh_interval)
                
            except Exception as e:
                print(f"Monitoring error: {e}")
                time.sleep(10)  # Wait before retrying
    
    def get_refresh_interval(self):
        """Lấy khoảng thời gian refresh"""
        try:
            interval_str = self.auto_refresh_combo.get()
            if interval_str == "5s":
                return 5
            elif interval_str == "10s":
                return 10
            elif interval_str == "30s":
                return 30
            elif interval_str == "1m":
                return 60
            elif interval_str == "5m":
                return 300
            else:
                return 10
        except:
            return 10
    
    def update_api_status(self):
        """Cập nhật trạng thái API"""
        try:
            # Test all APIs
            providers = ["momo", "bidv", "zalopay", "visa"]
            active_count = 0
            total_response_time = 0
            total_uptime = 0
            
            for provider in providers:
                status = self.test_api_status(provider)
                self.api_status[provider] = status
                
                # Update card
                if provider in self.api_cards:
                    self.update_api_card(provider, status)
                
                if status.get("active", False):
                    active_count += 1
                    total_response_time += status.get("response_time", 0)
                    total_uptime += status.get("uptime", 0)
            
            # Update overall status
            self.update_overall_status(active_count, len(providers), total_response_time, total_uptime)
            
            # Update last check time
            self.last_updated_label.configure(text=datetime.now().strftime("%H:%M:%S"))
            
            # Add log
            self.add_log(f"Status updated - {active_count}/{len(providers)} APIs active")
            
        except Exception as e:
            self.add_log(f"Error updating status: {str(e)}")
    
    def test_api_status(self, provider):
        """Test trạng thái một API"""
        try:
            start_time = time.time()
            
            # Call appropriate service
            if provider == "momo":
                result = self.app.momo_service.test_connection()
            elif provider == "bidv":
                result = self.app.bidv_service.test_connection()
            elif provider == "zalopay":
                result = self.app.zalopay_service.test_connection()
            elif provider == "visa":
                result = self.app.visa_service.test_connection()
            else:
                return {"active": False, "response_time": 0, "uptime": 0}
            
            response_time = int((time.time() - start_time) * 1000)
            
            return {
                "active": result.get("success", False),
                "response_time": response_time,
                "uptime": 99.5 if result.get("success", False) else 0,
                "message": result.get("message", ""),
                "last_check": datetime.now().strftime("%H:%M:%S")
            }
            
        except Exception as e:
            return {
                "active": False,
                "response_time": 0,
                "uptime": 0,
                "message": str(e),
                "last_check": datetime.now().strftime("%H:%M:%S")
            }
    
    def update_api_card(self, provider, status):
        """Cập nhật card API"""
        try:
            card = self.api_cards[provider]
            
            # Update status
            if status.get("active", False):
                card['status_label'].configure(text="🟢 Online", text_color="green")
            else:
                card['status_label'].configure(text="🔴 Offline", text_color="red")
            
            # Update response time
            card['response_label'].configure(text=f"Response: {status.get('response_time', 0)}ms")
            
            # Update uptime
            card['uptime_label'].configure(text=f"Uptime: {status.get('uptime', 0):.1f}%")
            
            # Update last check
            card['last_check_label'].configure(text=f"Last check: {status.get('last_check', '--:--:--')}")
            
        except Exception as e:
            print(f"Error updating card {provider}: {e}")
    
    def update_overall_status(self, active_count, total_count, total_response_time, total_uptime):
        """Cập nhật trạng thái tổng quan"""
        try:
            # Update active APIs
            self.active_apis_label.configure(text=f"{active_count}/{total_count}")
            
            # Update average response time
            if active_count > 0:
                avg_response = total_response_time / active_count
                self.avg_response_label.configure(text=f"{avg_response:.0f}ms")
                
                # Update uptime
                avg_uptime = total_uptime / active_count
                self.uptime_label.configure(text=f"{avg_uptime:.1f}%")
            else:
                self.avg_response_label.configure(text="--ms")
                self.uptime_label.configure(text="--%")
            
            # Update overall status
            if active_count == total_count:
                self.overall_status_label.configure(text="🟢 Tất cả hoạt động tốt", text_color="green")
            elif active_count > 0:
                self.overall_status_label.configure(text="🟡 Một số API gặp sự cố", text_color="orange")
            else:
                self.overall_status_label.configure(text="🔴 Tất cả API gặp sự cố", text_color="red")
                
        except Exception as e:
            print(f"Error updating overall status: {e}")
    
    def update_chart(self):
        """Cập nhật biểu đồ"""
        try:
            # Simulated chart data
            chart_data = """
RESPONSE TIME CHART (Last 24h)
==============================

MoMo:    ████████████████████████████████████████ 125ms
BIDV:    ████████████████████████████████████████ 120ms  
ZaloPay: ████████████████████████████████████████ 234ms
Visa:    ███████████████████████████████████████  67ms

HOURLY AVERAGE (ms)
00:00  01:00  02:00  03:00  04:00  05:00
 145    132    128    135    142    138

06:00  07:00  08:00  09:00  10:00  11:00
 140    155    162    158    145    142

12:00  13:00  14:00  15:00  16:00  17:00
 148    152    145    140    138    142

18:00  19:00  20:00  21:00  22:00  23:00
 150    145    142    138    135    140
"""
            
            self.chart_text.delete("1.0", "end")
            self.chart_text.insert("1.0", chart_data)
            
            # Update metrics
            metrics_data = f"""
CURRENT METRICS
===============
Total Requests: 1,247
Success Rate: 99.2%
Error Rate: 0.8%
Avg Response: 142ms
Peak Response: 890ms
Min Response: 45ms

ERRORS (24h)
============
Timeout: 5
Connection: 2
Invalid Response: 3
Rate Limit: 0

TRAFFIC PATTERN
===============
Peak Hours: 14:00-16:00
Low Hours: 02:00-05:00
Current Load: Medium
"""
            
            self.metrics_text.delete("1.0", "end")
            self.metrics_text.insert("1.0", metrics_data)
            
        except Exception as e:
            print(f"Error updating chart: {e}")
    
    def toggle_monitoring(self):
        """Bật/tắt monitoring"""
        if self.monitoring_active:
            self.monitoring_active = False
            self.monitoring_button.configure(text="▶️ Bắt đầu monitor")
            self.add_log("Monitoring stopped")
        else:
            self.start_monitoring()
            self.monitoring_button.configure(text="⏸️ Dừng monitor")
            self.add_log("Monitoring started")
    
    def refresh_status(self):
        """Làm mới trạng thái"""
        self.add_log("Manual refresh initiated")
        threading.Thread(target=self.update_api_status, daemon=True).start()
    
    def test_all_apis(self):
        """Test tất cả APIs"""
        self.add_log("Testing all APIs...")
        
        def test_thread():
            try:
                providers = ["momo", "bidv", "zalopay", "visa"]
                for provider in providers:
                    self.add_log(f"Testing {provider.upper()} API...")
                    self.test_single_api(provider)
                    time.sleep(1)  # Small delay between tests
                
                self.add_log("All API tests completed")
            except Exception as e:
                self.add_log(f"Error testing APIs: {str(e)}")
        
        threading.Thread(target=test_thread, daemon=True).start()
    
    def test_single_api(self, provider):
        """Test một API đơn lẻ"""
        self.add_log(f"Testing {provider.upper()} API...")
        
        def test_thread():
            try:
                status = self.test_api_status(provider)
                self.api_status[provider] = status
                
                if provider in self.api_cards:
                    self.update_api_card(provider, status)
                
                if status.get("active", False):
                    self.add_log(f"{provider.upper()} API - Online ({status.get('response_time', 0)}ms)")
                else:
                    self.add_log(f"{provider.upper()} API - Offline ({status.get('message', '')})")
                    
            except Exception as e:
                self.add_log(f"Error testing {provider.upper()}: {str(e)}")
        
        threading.Thread(target=test_thread, daemon=True).start()
    
    def open_api_config(self, provider):
        """Mở cấu hình API"""
        self.add_log(f"Opening {provider.upper()} configuration...")
        
        # Switch to admin tab
        self.app.tabview.set("⚙️ Quản trị")
        self.app.admin_frame.admin_tabview.set("🔑 Cấu hình API")
        
        self.app.show_message("Thông báo", f"Đã chuyển đến cấu hình {provider.upper()}", "info")
    
    def export_report(self):
        """Xuất báo cáo"""
        from tkinter import filedialog
        
        file_path = filedialog.asksaveasfilename(
            title="Xuất báo cáo API",
            defaultextension=".txt",
            filetypes=[("Text files", "*.txt"), ("JSON files", "*.json"), ("All files", "*.*")]
        )
        
        if file_path:
            try:
                report_data = {
                    "timestamp": datetime.now().isoformat(),
                    "overall_status": {
                        "active_apis": len([s for s in self.api_status.values() if s.get("active", False)]),
                        "total_apis": len(self.api_status),
                        "average_response_time": sum([s.get("response_time", 0) for s in self.api_status.values()]) / len(self.api_status) if self.api_status else 0,
                        "average_uptime": sum([s.get("uptime", 0) for s in self.api_status.values()]) / len(self.api_status) if self.api_status else 0
                    },
                    "api_status": self.api_status,
                    "logs": self.logs_text.get("1.0", "end")
                }
                
                if file_path.endswith(".json"):
                    with open(file_path, 'w', encoding='utf-8') as f:
                        json.dump(report_data, f, indent=2, ensure_ascii=False)
                else:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(f"API STATUS REPORT\n")
                        f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
                        f.write(f"Overall Status: {report_data['overall_status']}\n\n")
                        f.write(f"API Details:\n")
                        for provider, status in self.api_status.items():
                            f.write(f"{provider.upper()}: {status}\n")
                        f.write(f"\nLogs:\n{report_data['logs']}")
                
                self.add_log(f"Report exported to {file_path}")
                self.app.show_message("Thành công", "Đã xuất báo cáo thành công", "success")
                
            except Exception as e:
                self.add_log(f"Error exporting report: {str(e)}")
                self.app.show_message("Lỗi", f"Lỗi xuất báo cáo: {str(e)}", "error")
    
    def clear_logs(self):
        """Xóa logs"""
        self.logs_text.delete("1.0", "end")
        self.add_log("Logs cleared")
    
    def add_log(self, message):
        """Thêm log"""
        try:
            timestamp = datetime.now().strftime("%H:%M:%S")
            log_entry = f"[{timestamp}] {message}\n"
            
            self.logs_text.insert("end", log_entry)
            self.logs_text.see("end")
            
            # Keep only last 100 lines
            lines = self.logs_text.get("1.0", "end").split("\n")
            if len(lines) > 100:
                self.logs_text.delete("1.0", "end")
                self.logs_text.insert("1.0", "\n".join(lines[-100:]))
                
        except Exception as e:
            print(f"Error adding log: {e}")
    
    def __del__(self):
        """Cleanup when frame is destroyed"""
        self.monitoring_active = False