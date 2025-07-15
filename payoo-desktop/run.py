#!/usr/bin/env python3
"""
Payoo Desktop - Launcher script
Run this file to start the Payoo Desktop application
"""

import sys
import os

# Add the src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

if __name__ == "__main__":
    from main import main
    main()