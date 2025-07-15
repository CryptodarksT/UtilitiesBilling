import os
import json
from typing import Dict, Any, Optional
from cryptography.fernet import Fernet

class ConfigManager:
    """Quản lý cấu hình ứng dụng"""
    
    def __init__(self):
        self.config_dir = os.path.join(os.path.expanduser("~"), ".payoo")
        self.config_file = os.path.join(self.config_dir, "config.json")
        self.secure_config_file = os.path.join(self.config_dir, "secure_config.dat")
        self.key_file = os.path.join(self.config_dir, "key.key")
        
        # Tạo thư mục config nếu chưa có
        os.makedirs(self.config_dir, exist_ok=True)
        
        # Khởi tạo encryption key
        self.encryption_key = self._get_or_create_key()
        self.fernet = Fernet(self.encryption_key)
    
    def _get_or_create_key(self) -> bytes:
        """Lấy hoặc tạo encryption key"""
        if os.path.exists(self.key_file):
            with open(self.key_file, 'rb') as key_file:
                return key_file.read()
        else:
            key = Fernet.generate_key()
            with open(self.key_file, 'wb') as key_file:
                key_file.write(key)
            return key
    
    def load_config(self) -> Dict[str, Any]:
        """Tải cấu hình từ file"""
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                return self._create_default_config()
        except Exception as e:
            print(f"Lỗi tải cấu hình: {e}")
            return self._create_default_config()
    
    def save_config(self, config: Dict[str, Any]) -> bool:
        """Lưu cấu hình vào file"""
        try:
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            print(f"Lỗi lưu cấu hình: {e}")
            return False
    
    def load_secure_config(self) -> Dict[str, Any]:
        """Tải cấu hình bảo mật (API keys, credentials)"""
        try:
            if os.path.exists(self.secure_config_file):
                with open(self.secure_config_file, 'rb') as f:
                    encrypted_data = f.read()
                    decrypted_data = self.fernet.decrypt(encrypted_data)
                    return json.loads(decrypted_data.decode('utf-8'))
            else:
                return {}
        except Exception as e:
            print(f"Lỗi tải cấu hình bảo mật: {e}")
            return {}
    
    def save_secure_config(self, config: Dict[str, Any]) -> bool:
        """Lưu cấu hình bảo mật"""
        try:
            config_json = json.dumps(config, ensure_ascii=False)
            encrypted_data = self.fernet.encrypt(config_json.encode('utf-8'))
            
            with open(self.secure_config_file, 'wb') as f:
                f.write(encrypted_data)
            return True
        except Exception as e:
            print(f"Lỗi lưu cấu hình bảo mật: {e}")
            return False
    
    def _create_default_config(self) -> Dict[str, Any]:
        """Tạo cấu hình mặc định"""
        default_config = {
            "app_settings": {
                "theme": "light",
                "language": "vi",
                "auto_save": True,
                "window_size": "1200x800",
                "window_position": "center"
            },
            "api_settings": {
                "timeout": 30,
                "retry_count": 3,
                "sandbox_mode": True
            },
            "ui_settings": {
                "show_notifications": True,
                "sound_enabled": True,
                "animation_enabled": True
            },
            "payment_settings": {
                "default_payment_method": "momo",
                "auto_fill_customer_info": True,
                "confirmation_required": True
            },
            "history_settings": {
                "max_records": 1000,
                "auto_cleanup": True,
                "export_format": "excel"
            }
        }
        
        # Lưu cấu hình mặc định
        self.save_config(default_config)
        return default_config
    
    def get_setting(self, key: str, default_value: Any = None) -> Any:
        """Lấy giá trị cài đặt"""
        config = self.load_config()
        keys = key.split('.')
        
        current = config
        for k in keys:
            if isinstance(current, dict) and k in current:
                current = current[k]
            else:
                return default_value
        
        return current
    
    def set_setting(self, key: str, value: Any) -> bool:
        """Đặt giá trị cài đặt"""
        config = self.load_config()
        keys = key.split('.')
        
        current = config
        for k in keys[:-1]:
            if k not in current:
                current[k] = {}
            current = current[k]
        
        current[keys[-1]] = value
        return self.save_config(config)
    
    def get_api_config(self, provider: str) -> Dict[str, Any]:
        """Lấy cấu hình API cho provider"""
        secure_config = self.load_secure_config()
        return secure_config.get(f"{provider}_api", {})
    
    def set_api_config(self, provider: str, config: Dict[str, Any]) -> bool:
        """Đặt cấu hình API cho provider"""
        secure_config = self.load_secure_config()
        secure_config[f"{provider}_api"] = config
        return self.save_secure_config(secure_config)
    
    def clear_api_config(self, provider: str) -> bool:
        """Xóa cấu hình API cho provider"""
        secure_config = self.load_secure_config()
        if f"{provider}_api" in secure_config:
            del secure_config[f"{provider}_api"]
            return self.save_secure_config(secure_config)
        return True
    
    def export_config(self, file_path: str, include_secure: bool = False) -> bool:
        """Xuất cấu hình ra file"""
        try:
            config = self.load_config()
            
            if include_secure:
                secure_config = self.load_secure_config()
                config["secure_config"] = secure_config
            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
            
            return True
        except Exception as e:
            print(f"Lỗi xuất cấu hình: {e}")
            return False
    
    def import_config(self, file_path: str) -> bool:
        """Nhập cấu hình từ file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
            
            # Tách secure config nếu có
            secure_config = config.pop("secure_config", {})
            
            # Lưu config thường
            success = self.save_config(config)
            
            # Lưu secure config nếu có
            if secure_config and success:
                success = self.save_secure_config(secure_config)
            
            return success
        except Exception as e:
            print(f"Lỗi nhập cấu hình: {e}")
            return False
    
    def reset_config(self) -> bool:
        """Reset cấu hình về mặc định"""
        try:
            # Xóa file cấu hình cũ
            if os.path.exists(self.config_file):
                os.remove(self.config_file)
            
            if os.path.exists(self.secure_config_file):
                os.remove(self.secure_config_file)
            
            # Tạo lại cấu hình mặc định
            self._create_default_config()
            return True
        except Exception as e:
            print(f"Lỗi reset cấu hình: {e}")
            return False
    
    def backup_config(self, backup_dir: str) -> bool:
        """Sao lưu cấu hình"""
        try:
            import shutil
            from datetime import datetime
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_file = os.path.join(backup_dir, f"payoo_config_backup_{timestamp}.json")
            
            return self.export_config(backup_file, include_secure=True)
        except Exception as e:
            print(f"Lỗi sao lưu cấu hình: {e}")
            return False
    
    def get_all_providers(self) -> list:
        """Lấy danh sách tất cả providers đã cấu hình"""
        secure_config = self.load_secure_config()
        providers = []
        
        for key in secure_config.keys():
            if key.endswith("_api"):
                provider = key.replace("_api", "")
                providers.append(provider)
        
        return providers
    
    def validate_config(self) -> Dict[str, Any]:
        """Kiểm tra tính hợp lệ của cấu hình"""
        config = self.load_config()
        secure_config = self.load_secure_config()
        
        validation_result = {
            "valid": True,
            "errors": [],
            "warnings": []
        }
        
        # Kiểm tra cấu hình cơ bản
        required_keys = ["app_settings", "api_settings", "ui_settings"]
        for key in required_keys:
            if key not in config:
                validation_result["valid"] = False
                validation_result["errors"].append(f"Thiếu cấu hình: {key}")
        
        # Kiểm tra cấu hình API
        providers = self.get_all_providers()
        for provider in providers:
            provider_config = secure_config.get(f"{provider}_api", {})
            if not provider_config:
                validation_result["warnings"].append(f"Chưa cấu hình API cho {provider}")
        
        return validation_result