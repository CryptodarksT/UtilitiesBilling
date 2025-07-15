import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
import os
from datetime import datetime
import tempfile

class ExcelProcessor:
    """Xử lý file Excel cho bulk operations"""
    
    def __init__(self):
        self.supported_formats = ['.xlsx', '.xls', '.csv']
        
    def read_excel_file(self, file_path: str) -> Dict[str, Any]:
        """Đọc file Excel"""
        try:
            file_ext = os.path.splitext(file_path)[1].lower()
            
            if file_ext == '.csv':
                df = pd.read_csv(file_path, encoding='utf-8')
            elif file_ext in ['.xlsx', '.xls']:
                df = pd.read_excel(file_path, engine='openpyxl' if file_ext == '.xlsx' else 'xlrd')
            else:
                return {
                    "success": False,
                    "message": f"Định dạng file không hỗ trợ: {file_ext}"
                }
            
            return {
                "success": True,
                "data": df,
                "rows": len(df),
                "columns": list(df.columns),
                "message": f"Đã đọc {len(df)} dòng dữ liệu"
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Lỗi đọc file: {str(e)}"
            }
    
    def validate_bill_data(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Validate dữ liệu hóa đơn"""
        required_columns = ['customer_id', 'bill_type', 'amount']
        validation_result = {
            "valid": True,
            "errors": [],
            "warnings": [],
            "processed_rows": 0
        }
        
        # Kiểm tra cột bắt buộc
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            validation_result["valid"] = False
            validation_result["errors"].append(f"Thiếu cột bắt buộc: {', '.join(missing_columns)}")
            return validation_result
        
        # Kiểm tra dữ liệu từng dòng
        for index, row in df.iterrows():
            row_errors = []
            
            # Kiểm tra customer_id
            if pd.isna(row['customer_id']) or str(row['customer_id']).strip() == '':
                row_errors.append("Thiếu mã khách hàng")
            
            # Kiểm tra bill_type
            if pd.isna(row['bill_type']) or str(row['bill_type']).strip() == '':
                row_errors.append("Thiếu loại hóa đơn")
            
            # Kiểm tra amount
            try:
                amount = float(row['amount'])
                if amount <= 0:
                    row_errors.append("Số tiền phải lớn hơn 0")
            except (ValueError, TypeError):
                row_errors.append("Số tiền không hợp lệ")
            
            if row_errors:
                validation_result["errors"].append(f"Dòng {index + 2}: {', '.join(row_errors)}")
            else:
                validation_result["processed_rows"] += 1
        
        if validation_result["errors"]:
            validation_result["valid"] = False
        
        return validation_result
    
    def process_bill_upload(self, file_path: str) -> Dict[str, Any]:
        """Xử lý upload file hóa đơn"""
        try:
            # Đọc file
            read_result = self.read_excel_file(file_path)
            if not read_result["success"]:
                return read_result
            
            df = read_result["data"]
            
            # Validate dữ liệu
            validation_result = self.validate_bill_data(df)
            if not validation_result["valid"]:
                return {
                    "success": False,
                    "message": "Dữ liệu không hợp lệ",
                    "errors": validation_result["errors"]
                }
            
            # Xử lý dữ liệu
            processed_bills = []
            for index, row in df.iterrows():
                try:
                    bill_data = {
                        "customer_id": str(row['customer_id']).strip(),
                        "bill_type": str(row['bill_type']).strip(),
                        "amount": float(row['amount']),
                        "provider": str(row.get('provider', '')).strip(),
                        "description": str(row.get('description', '')).strip(),
                        "due_date": str(row.get('due_date', '')).strip(),
                        "period": str(row.get('period', '')).strip(),
                        "row_number": index + 2
                    }
                    processed_bills.append(bill_data)
                except Exception as e:
                    continue
            
            return {
                "success": True,
                "bills": processed_bills,
                "total_rows": len(df),
                "processed_rows": len(processed_bills),
                "message": f"Đã xử lý {len(processed_bills)} hóa đơn"
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Lỗi xử lý file: {str(e)}"
            }
    
    def create_bill_template(self) -> Dict[str, Any]:
        """Tạo template Excel cho hóa đơn"""
        try:
            # Tạo data mẫu
            sample_data = {
                'customer_id': ['CUST001', 'CUST002', 'CUST003'],
                'bill_type': ['electric', 'water', 'internet'],
                'amount': [500000, 300000, 200000],
                'provider': ['EVN_HCMC', 'SAWACO', 'VNPT'],
                'description': ['Tiền điện tháng 7', 'Tiền nước tháng 7', 'Cước internet tháng 7'],
                'due_date': ['2025-08-15', '2025-08-20', '2025-08-25'],
                'period': ['2025-07', '2025-07', '2025-07']
            }
            
            df = pd.DataFrame(sample_data)
            
            # Tạo file tạm
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx')
            temp_file.close()
            
            # Ghi file Excel
            with pd.ExcelWriter(temp_file.name, engine='openpyxl') as writer:
                df.to_excel(writer, sheet_name='Bills', index=False)
                
                # Thêm sheet hướng dẫn
                instructions = pd.DataFrame({
                    'Cột': ['customer_id', 'bill_type', 'amount', 'provider', 'description', 'due_date', 'period'],
                    'Mô tả': [
                        'Mã khách hàng (bắt buộc)',
                        'Loại hóa đơn: electric, water, internet, tv (bắt buộc)',
                        'Số tiền (bắt buộc)',
                        'Nhà cung cấp (tùy chọn)',
                        'Mô tả hóa đơn (tùy chọn)',
                        'Hạn thanh toán (tùy chọn)',
                        'Kỳ thanh toán (tùy chọn)'
                    ],
                    'Ví dụ': [
                        'CUST001',
                        'electric',
                        '500000',
                        'EVN_HCMC',
                        'Tiền điện tháng 7',
                        '2025-08-15',
                        '2025-07'
                    ]
                })
                instructions.to_excel(writer, sheet_name='Instructions', index=False)
            
            return {
                "success": True,
                "file_path": temp_file.name,
                "message": "Đã tạo template thành công"
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Lỗi tạo template: {str(e)}"
            }
    
    def export_payment_history(self, payments: List[Dict[str, Any]], file_path: str) -> Dict[str, Any]:
        """Xuất lịch sử thanh toán ra Excel"""
        try:
            if not payments:
                return {
                    "success": False,
                    "message": "Không có dữ liệu để xuất"
                }
            
            # Chuyển đổi dữ liệu
            export_data = []
            for payment in payments:
                export_data.append({
                    'Mã giao dịch': payment.get('transaction_id', ''),
                    'Mã khách hàng': payment.get('customer_id', ''),
                    'Tên khách hàng': payment.get('customer_name', ''),
                    'Loại hóa đơn': payment.get('bill_type', ''),
                    'Nhà cung cấp': payment.get('provider', ''),
                    'Số tiền': payment.get('amount', 0),
                    'Phương thức': payment.get('payment_method', ''),
                    'Trạng thái': payment.get('status', ''),
                    'Ngày thanh toán': payment.get('payment_date', ''),
                    'Mô tả': payment.get('description', '')
                })
            
            df = pd.DataFrame(export_data)
            
            # Ghi file
            with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
                df.to_excel(writer, sheet_name='Payment History', index=False)
                
                # Thêm sheet thống kê
                stats_data = {
                    'Thống kê': [
                        'Tổng số giao dịch',
                        'Tổng số tiền',
                        'Giao dịch thành công',
                        'Giao dịch thất bại',
                        'Tỷ lệ thành công'
                    ],
                    'Giá trị': [
                        len(payments),
                        sum([p.get('amount', 0) for p in payments]),
                        len([p for p in payments if p.get('status') == 'success']),
                        len([p for p in payments if p.get('status') == 'failed']),
                        f"{len([p for p in payments if p.get('status') == 'success']) / len(payments) * 100:.1f}%"
                    ]
                }
                stats_df = pd.DataFrame(stats_data)
                stats_df.to_excel(writer, sheet_name='Statistics', index=False)
            
            return {
                "success": True,
                "file_path": file_path,
                "total_records": len(payments),
                "message": f"Đã xuất {len(payments)} bản ghi"
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Lỗi xuất file: {str(e)}"
            }
    
    def create_payment_report(self, payments: List[Dict[str, Any]], 
                             start_date: str = None, end_date: str = None) -> Dict[str, Any]:
        """Tạo báo cáo thanh toán"""
        try:
            if not payments:
                return {
                    "success": False,
                    "message": "Không có dữ liệu để tạo báo cáo"
                }
            
            # Tạo file tạm
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx')
            temp_file.close()
            
            with pd.ExcelWriter(temp_file.name, engine='openpyxl') as writer:
                # Sheet 1: Tổng quan
                overview_data = {
                    'Thống kê tổng quan': [
                        'Tổng số giao dịch',
                        'Tổng giá trị',
                        'Giao dịch thành công',
                        'Giao dịch thất bại',
                        'Tỷ lệ thành công',
                        'Giá trị trung bình'
                    ],
                    'Giá trị': [
                        len(payments),
                        f"{sum([p.get('amount', 0) for p in payments]):,.0f} VNĐ",
                        len([p for p in payments if p.get('status') == 'success']),
                        len([p for p in payments if p.get('status') == 'failed']),
                        f"{len([p for p in payments if p.get('status') == 'success']) / len(payments) * 100:.1f}%",
                        f"{sum([p.get('amount', 0) for p in payments]) / len(payments):,.0f} VNĐ"
                    ]
                }
                overview_df = pd.DataFrame(overview_data)
                overview_df.to_excel(writer, sheet_name='Tổng quan', index=False)
                
                # Sheet 2: Theo loại hóa đơn
                bill_types = {}
                for payment in payments:
                    bill_type = payment.get('bill_type', 'Khác')
                    if bill_type not in bill_types:
                        bill_types[bill_type] = {"count": 0, "amount": 0}
                    bill_types[bill_type]["count"] += 1
                    bill_types[bill_type]["amount"] += payment.get('amount', 0)
                
                bill_type_data = []
                for bill_type, stats in bill_types.items():
                    bill_type_data.append({
                        'Loại hóa đơn': bill_type,
                        'Số lượng': stats["count"],
                        'Tổng tiền': f"{stats['amount']:,.0f} VNĐ",
                        'Tỷ lệ': f"{stats['count'] / len(payments) * 100:.1f}%"
                    })
                
                bill_type_df = pd.DataFrame(bill_type_data)
                bill_type_df.to_excel(writer, sheet_name='Theo loại hóa đơn', index=False)
                
                # Sheet 3: Theo phương thức thanh toán
                payment_methods = {}
                for payment in payments:
                    method = payment.get('payment_method', 'Khác')
                    if method not in payment_methods:
                        payment_methods[method] = {"count": 0, "amount": 0}
                    payment_methods[method]["count"] += 1
                    payment_methods[method]["amount"] += payment.get('amount', 0)
                
                method_data = []
                for method, stats in payment_methods.items():
                    method_data.append({
                        'Phương thức': method,
                        'Số lượng': stats["count"],
                        'Tổng tiền': f"{stats['amount']:,.0f} VNĐ",
                        'Tỷ lệ': f"{stats['count'] / len(payments) * 100:.1f}%"
                    })
                
                method_df = pd.DataFrame(method_data)
                method_df.to_excel(writer, sheet_name='Theo phương thức', index=False)
                
                # Sheet 4: Chi tiết giao dịch
                detail_data = []
                for payment in payments:
                    detail_data.append({
                        'Mã GD': payment.get('transaction_id', ''),
                        'Ngày': payment.get('payment_date', ''),
                        'Khách hàng': payment.get('customer_name', ''),
                        'Loại HĐ': payment.get('bill_type', ''),
                        'Số tiền': payment.get('amount', 0),
                        'Phương thức': payment.get('payment_method', ''),
                        'Trạng thái': payment.get('status', '')
                    })
                
                detail_df = pd.DataFrame(detail_data)
                detail_df.to_excel(writer, sheet_name='Chi tiết', index=False)
            
            return {
                "success": True,
                "file_path": temp_file.name,
                "message": "Đã tạo báo cáo thành công"
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": f"Lỗi tạo báo cáo: {str(e)}"
            }
    
    def validate_file_format(self, file_path: str) -> Dict[str, Any]:
        """Validate định dạng file"""
        try:
            file_ext = os.path.splitext(file_path)[1].lower()
            
            if file_ext not in self.supported_formats:
                return {
                    "valid": False,
                    "message": f"Định dạng file không hỗ trợ. Hỗ trợ: {', '.join(self.supported_formats)}"
                }
            
            # Kiểm tra file có tồn tại
            if not os.path.exists(file_path):
                return {
                    "valid": False,
                    "message": "File không tồn tại"
                }
            
            # Kiểm tra kích thước file (max 10MB)
            file_size = os.path.getsize(file_path)
            if file_size > 10 * 1024 * 1024:
                return {
                    "valid": False,
                    "message": "File quá lớn (tối đa 10MB)"
                }
            
            return {
                "valid": True,
                "message": "File hợp lệ",
                "file_size": file_size,
                "file_format": file_ext
            }
            
        except Exception as e:
            return {
                "valid": False,
                "message": f"Lỗi kiểm tra file: {str(e)}"
            }