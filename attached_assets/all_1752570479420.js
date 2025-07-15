
/**
 * Javascript functions file . all.js
 * Date: 2008
 * @category 	data/interface/v1_0/js
 * @author		Nam.Nguyen <nam.nguyen@vietunion.com.vn>
 * @author		Tri.Le <tri.le@vietunion.com.vn>
 * @author		Vuong.Ho <vuong.ho@vietunion.com.vn>
 * @link		https://www.payoo.com.vn/
 * @copyright 	Copyright (c) 2008 VietUnion online services corporation.
 * @version		1.0
 */
var editwin = null;

/**
 * Open file in a new window in expected size
 * Date : 2009
 *
 * @param string File file to be open in new window
 * @param integer W width of window
 * @param integer H heigh of window
 * @return none
 *
 * @author Nam.Nguyen <nam.nguyen@vietunion.com.vn>
 * @since function available since version 1.0
 */
function OWEdit(File, W, H) {
	W += 50;
	H += 50;

	/**
	 * Max width is 780px
	 */
	if(W > 780)	{
		W = 780;
	}

	/**
	 * Max heigh is 600px
	 */
	if(H > 600)	{
		H = 600;
	}

	//window properites
	Temp = "scrollbars=2, resizable=yes, width=" + W + ", height = " + H;
	window.open(File, "FullImage", Temp);
}
/**
 * Open file in a new window in expected size
 * Date : 2008
 *
 * @param string File file to be open in new window
 * @param integer W width of window
 * @param integer H heigh of window
 * @param string Name name of new window
 * @return none
 *
 * @author Nam.Nguyen <nam.nguyen@vietunion.com.vn>
 * @since function available since version 1.0
 */
function OWE(File, W, H, Name) {
	W += 200;
	H += 250;
	if(W > 800) {
		W = 800;
	}

	if(H > 750) {
		H = 750;
	}

	Temp = "scrollbars=1, resizable=1, width=" + W + ", height = " + H;
	wopen = window.open(File, Name, Temp);
	wopen.focus();
}

/**
 * Open file in a new window in expected size
 * Date : 2009
 *
 * @param string File URL to file
 * @return none
 *
 * @author Nam.Nguyen <nam.nguyen@vietunion.com.vn>
 * @since function available since version 1.0
 */
function OWE1(File) {
	opener.location.href = File;
	window.close();
	opener.focus();
}


/**
 * Check whether a string contain another string
 * Date : 2008
 *
 * @param string strss The string to search in
 * @param string mark The string will be searched
 * @return boolean return true if strss contains mark, otherwise return false
 *
 * @author Bao.Tran
 * @since function available since version 1.0
 */
function CheckMarkVal(strss, mark) {
	for(i = 0; i < mark.length && strss.indexOf(mark.charAt(i)) < 0; i++);

	return (i < mark.length) ? false : true;
}

var reAlphanumeric = /^[a-zA-Z0-9]+$/;//alphanumeric pattern

/**
 * Strip whitespace from the beginning and end of a string
 * Date : 2007
 *
 * @param string str The string that will be trimmed
 * @return string The trimmed string
 *
 * @author Bao.Tran
 * @since function available since version 1.0
 */
function trim(str) {
	return str.replace(/^\s+|\s+$/g, '');
}

/**
 * Finds whether a variable is empty
 * Date : 2007
 *
 * @param string s variable to be evaluated
 * @return boolean return true if s is null or empty, false otherwise
 *
 * @author Bao.Tran
 * @since function available since version 1.0
 */
function isEmpty(s){
	return ((s == null) || (s.length == 0))
}

/**
 * Finds whether a variable is a number or a numeric string
 * Date : 2007
 *
 * @param string s The variable being evaluated
 * @return boolean Returns TRUE if s is a number or a numeric string, FALSE otherwise.
 *
 * @author Bao.Tran
 * @since function available since version 1.0
 */
function isAlphanumeric(s){
	if (isEmpty(s) == false)
		return reAlphanumeric.test(s);
}

/**
 * Finds whether a variable is a valid character
 * Date : 2007
 *
 * @param char s The variable being evaluated
 * @return boolean Returns TRUE if s is a valid character, FALSE otherwise.
 *
 * @author Bao.Tran
 * @since function available since version 1.0
 */
function isValidChar(s){
	if(isEmpty(s) == false){
		var valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
		var temp;

		for (var i = 0; i < s.length; i++) {
			temp = "" + s.substring(i, i + 1);
			if (valid.indexOf(temp) == "-1") {
				return false;
			}
		}

		return true;
	}
}

/**
 * description...
 * Date : 2008
 *
 * @param s
 * @return unknown_type
 *
 * @author Nam.Nguyen <nam.nguyen@vietunion.com.vn>
 * @since function available since version 1.0
 */
function filterValidChar(s){
	if(s.length > 0){
		var valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_.";
		var temp = s;

		for (var i = 0; i < s.length; i++) {
			var ktu = s.substring(i, i + 1);

			if (valid.indexOf(ktu) < 0) {
				//eval('temp = temp.replace(/@'+s[i]+'/gi,\'\');');
				var idx = temp.indexOf(ktu);

				while ( idx > -1 ) {
					temp = temp.replace( ktu, '');
					idx = temp.indexOf(ktu);
				}
			}
		}

		return temp;
	}

	return s;
}

/**
 * Finds whether a variable is in valid email format
 * Date : 2008
 *
 * @param string emailStr The variable being evaluated
 * @return boolean Returns TRUE if emailStr is a valid email format, FALSE otherwise.
 *
 * @author Tri.Le <tri.le@vietunion.com.vn>
 * @since function available since version 1.0
 */
function emailCheck (emailStr) {
	emailStr = emailStr.trim();
	var emailPattern = /^[a-z0-9\_\.\-]{1,}\@[a-z0-9\-]{2,}(\.[a-z0-9\-]{2,}){1,}$/i;
	/*var email = emailStr.split('@');
	if (email[0].length < 6) {
		return false;
	}*/
	return emailPattern.test(emailStr);
}

/**
 * Finds whether a variable is in valid phone/fax number format
 * Date : 2008
 *
 * @param string phoneNo The variable being evaluated
 * @return boolean Returns TRUE if phoneNo is in valid phone number format, FALSE otherwise.
 *
 * @author Tri.Le <tri.le@vietunion.com.vn>
 * @since function available since version 1.0
 */
function phoneNoCheck(phoneNo)
{
	var phoneMask = /^[0-9]{5,20}$/;
	phoneNo.trim();
	return phoneMask.test(phoneNo);
}

/**
 * Finds whether a variable is in valid username
 * Date : 2007
 *
 * @param string userName The variable being evaluated
 * @return boolean Returns TRUE if userName is a valid username, FALSE otherwise.
 *
 * @author Bao.Tran <bao.tran@vietunion.com.vn>
 * @since function available since version 1.0
 */
function isUsername(userName)
{
	var pattern=/^[a-z0-9_-][a-z0-9_-]{2,30}$/i;
	//var pattern=/*;
	if (!pattern.test(userName)) {
		return false;
	}

	return true;
}

/**
 * Finds whether a variable is in valid phone/fax number format
 * Date : 2008
 *
 * @param string phone The variable being evaluated
 * @return boolean Returns TRUE if phone is in valid phone/fax number format, FALSE otherwise.
 *
 * @author Bao.Tran
 * @since function available since version 1.0
 */
function isTelephone(phone)
{
	var pattern = /^\+?[0-9 ()-.]+[0-9.]$/;
	var phoneval=trim(phone);
	if (!pattern.test(phoneval)) return false;
	return true;
}

/**
 * Returns the number of occurrences of a character in a string
 * Date : 2008
 *
 * @param string strss string to be search in
 * @param char mark character to be counted
 * @return integer number of occurrences
 *
 * @author
 * @since function available since version 1.0
 */
function countChar(str, mark) {
	var Count = 0;
	for(i = 0; i < str.length; i++) {
		if (str.charAt(i) == mark) {
			Count++;
		}
	}

	return 	Count;
}

/**
 * Returns day number in a string Date
 * Date : 2008
 *
 * @param string strDate string date to be get day
 * @return integer day in month
 *
 * @author
 * @since function available since version 1.0
 */
function getDateToInt(strDate) {
	k = strDate.indexOf("/");
	strDay = strDate.substring(0, k);
	return stringToInt(strDay);
}

/**
 * Returns month number in a string date
 * Date : 2008
 *
 * @param string strDate string date to be get month
 * @return integer month
 *
 * @author
 * @since function available since version 1.0
 */
function getMonthToInt(strDate) {
	i = strDate.lastIndexOf("/");
	j = strDate.lastIndexOf("/", i - 1) ;
	strMonth = strDate.substring(j + 1, i);
	return stringToInt(strMonth);
}

/**
 * Returns year number in a string date
 * Date : 2008
 *
 * @param string strDate string date to be get year
 * @return integer year
 *
 * @author
 * @since function available since version 1.0
 */
function getYearToInt(strDate) {
	i = strDate.lastIndexOf("/");
	strYear = strDate.substring(i + 1, strDate.length);
	return stringToInt(strYear);
}

/**
 * Returns day number in a string format dd/mm/yyyy H:i
 * Date : 2008
 *
 * @param string strDate string date to be get day
 * @return integer day
 *
 * @author
 * @since function available since version 1.0
 */
function getDaytimeToInt(strDate) {
	k = strDate.indexOf("/");
	strDay = strDate.substring(0, k);
	return stringToInt(strDay);
}

/**
 * Returns month number in a string format dd/mm/yyyy H:i
 * Date : 2008
 *
 * @param string strDate string date to be get month
 * @return integer month
 *
 * @author
 * @since function available since version 1.0
 */
function getMonthtimeToInt(strDate) {
	i = strDate.indexOf("/");
	strMonth = strDate.substring(i + 1, i+3);
	return stringToInt(strMonth);
}

/**
 * Returns year number in a string format dd/mm/yyyy H:i
 * Date : 2008
 *
 * @param string strDate string date to be get year
 * @return integer year
 *
 * @author
 * @since function available since version 1.0
 */
function getYeartimeToInt(strDate) {
	i = strDate.lastIndexOf("/");
	strYear = strDate.substring(i + 1, i+5);
	return stringToInt(strYear);
}

/**
 * Returns hour in a string format dd/mm/yyyy H:i
 * Date : 2008
 *
 * @param string strDate string date to be get hour
 * @return integer hour
 *
 * @author
 * @since function available since version 1.0
 */
function getHourtimeToInt(strDate) {
	i = strDate.indexOf(":");
	strHour = strDate.substring(i - 2, i);

	return stringToInt(strHour);
}

/**
 * Returns minute in a string format dd/mm/yyyy H:i
 * Date : 2008
 *
 * @param string strDate string date to be get minute
 * @return integer minute
 *
 * @author
 * @since function available since version 1.0
 */
function getMinutetimeToInt(strDate) {
	i = strDate.lastIndexOf(":");
	strMinute = strDate.substring(i + 1, strDate.length);

	return stringToInt(strMinute);
}

/**
 * Finds whether a integer variable is in a range
 * Date : 2008
 *
 * @param integer val variable being evaluated
 * @param integer low the lowest value
 * @param integer high the highest value
 * @return boolean return true if val between low and high, false otherwise
 *
 * @author
 * @since function available since version 1.0
 */
function checkIntVal(val, low, high) {
	if (val <= high && val >= low) {
		return true;
	}
	return false;
}


/**
 * Converts string to integer
 * Date : 2008
 *
 * @param string str string to be converted
 * @return integer the number converted, return 0 if the str is not a number string
 *
 * @author
 * @since function available since version 1.0
 */
function stringToInt(str) {
	if(!stringIsNum(str)) {
		return 0 ;
	}

	if(str.charAt(0) == '0') {
		return stringToInt(str.substring(1, str.length));
	} else {
		if(str.length > 0) {
			return parseInt(str, 10);
		} else {
			return (0);
		}
	}
}

/**
 * Finds whether a variable is a numeric string
 * Date : 2008
 *
 * @param string val The variable being evaluated
 * @return boolean Returns TRUE if val is a number or a numeric string, FALSE otherwise.
 *
 * @author
 * @since function available since version 1.0
 */
function stringIsNum(val) {
	var str = new String(val);
	for (i = 0; i < str.length; i++) {
		if (isNaN(parseInt(str.charAt(i)))) {
			return false;
		}
	}
	return true;
}

/**
 * Finds whether a string contain another string
 * Date : 2008
 *
 * @param string str string being searched in
 * @param string mark string being searched
 * @return boolean
 *
 * @author
 * @since function available since version 1.0
 */
function checkExistVal(str, mark) {
	for(i = 0; i < str.length; i++) {
		if (mark.indexOf(str.charAt(i)) < 0) {
			return false;
		}
	}
	return 	true;
}

/**
 * Finds whether a string is in a valid dd/mm/yyyy date format
 * Date : 2008
 *
 * @param strDate
 * @param sb_year
 * @param se_year
 * @return boolean
 *
 * @author
 * @since function available since version 1.0
 */
function checkFormatDate(strDate, sb_year, se_year) {
	if(!checkExistVal(strDate, '1234567890/') || countChar(strDate, '/') != 2) {
		return false;
	}

	Year = getYearToInt(strDate);
	Month = getMonthToInt(strDate);
	Day = getDateToInt(strDate);

	var objDate = new Date();
	var currYear = objDate.getYear();

	if(typeof(sb_year) == 'undefined') {
		sb_year = currYear - 1;
	}

	if(typeof(se_year) == 'undefined') {
		se_year = currYear + 222;
	}

	if(!checkIntVal(Year, sb_year, se_year)) {
		return false;
	}

	if(!checkIntVal(Month, 1, 12)) {
		return false;
	}

	if(!checkIntVal(Day, 1, 31)) {
		return false;
	}

	if (Month == 4 || Month == 6 || Month == 9 || Month == 11 ) {
		if(Day > 30) {
			return false;
		}
	}

	if(((Year % 4 == 0) && (Year %100 != 0)) || Year % 400 == 0) {
		if((Month == 2 ) && ( Day > 29))
			return false;
	} else {
		if((Month == 2 ) && ( Day > 28)) {
			return false;
		}
	}

	return 	true;
}

/**
 * Finds whether a string is in a valid dd/mm/yyyy H:i date format
 * Date : 2008
 *
 * @param strDate
 * @param sb_year
 * @param se_year
 * @return boolean
 *
 * @author
 * @since function available since version 1.0
 */
function checkFormatDatetime(strDate, sb_year, se_year) {
	if(!checkExistVal(strDate, '1234567890/: ') || countChar(strDate, '/') != 2 ||
		countChar(strDate, ':') != 1 || countChar(strDate, ' ') != 1) {
		return false;
	}
	Year = getYeartimeToInt(strDate);
	Month = getMonthtimeToInt(strDate);
	Day = getDaytimeToInt(strDate);
	Hour = getHourtimeToInt(strDate);
	Minute = getMinutetimeToInt(strDate);

	var objDate = new Date();
	var currYear = objDate.getYear();

	if(typeof(sb_year) == 'undefined') {
		sb_year = currYear - 1;
	}

	if(typeof(se_year) == 'undefined') {
		se_year = currYear + 222;
	}

	if(!checkIntVal(Year, sb_year, se_year)){
		return false;
	}

	if(!checkIntVal(Month, 1, 12)) {
		return false;
	}

	if(!checkIntVal(Day, 1, 31)) {
		return false;
	}

	if (Month == 4 || Month == 6 || Month == 9 || Month == 11 ) {
		if(Day > 30) {
			return false;
		}
	}

	if(((Year % 4 == 0) && (Year %100 != 0)) || Year % 400 == 0) {
		if((Month == 2 ) && ( Day > 29)) {
			return false;
		}
	} else {
		if((Month == 2 ) && ( Day > 28)) {
			return false;
		}
	}

	if((Hour > 23) || ( Minute > 59)) {
		return false;
	}

	return 	true;
}

/**
 * Finds whether start date is smaller than end date
 * Date : 2008
 *
 * @param string fromDate start date in d/m/Y format
 * @param string toDate end date in d/m/Y format
 * @return boolean
 *
 * @author Vuong.Ho <vuong.ho@vietunion.com.vn>
 * @since function available since version 1.0
 */
function checkCondDate(fromDate, toDate) {
	fromYear = getYearToInt(fromDate);
	fromMonth = getMonthToInt(fromDate);
	fromDay = getDateToInt(fromDate);
	toYear = getYearToInt(toDate);
	toMonth = getMonthToInt(toDate);
	toDay = getDateToInt(toDate);
	if(fromYear < toYear) {
		return true;
	}

	if(fromYear == toYear) {
		if(fromMonth == toMonth) {
			if(fromDay <= toDay) {
				return true;
			}
		} else {
			if(fromMonth < toMonth) {
				return true;
			}
		}
	}
	return false;
}

/**
 * Finds whether start date is smaller than end date
 * Date : 2008
 *
 * @param string fromDate start date in d/m/Y H:i format
 * @param string toDate end date in d/m/Y H:i format
 * @return boolean
 *
 * @author Vuong.Ho <vuong.ho@vietunion.com.vn>
 * @since function available since version 1.0
 */
function checkCondDatetime(fromDate, toDate) {
	fromYear = getYeartimeToInt(fromDate);
	fromMonth = getMonthtimeToInt(fromDate);
	fromDay = getDaytimeToInt(fromDate);
	fromHour = getHourtimeToInt(fromDate);
	fromMinute = getMinutetimeToInt(fromDate);
	toYear = getYeartimeToInt(toDate);
	toMonth = getMonthtimeToInt(toDate);
	toDay = getDaytimeToInt(toDate);
	toHour = getHourtimeToInt(toDate);
	toMinute = getMinutetimeToInt(toDate);

	if(fromYear < toYear) {
		return true;
	}

	if(fromYear == toYear) {
		if(fromMonth == toMonth) {
			if(fromDay == toDay){
				if(fromHour == toHour){
					if(fromMinute <= toMinute) {
						return true;
					}
				} else {
					if(fromHour < toHour) {
						return true;
					}
				}
			} else {
				if(fromDay < toDay) {
					return true;
				}
			}
		} else {
			if(fromMonth < toMonth) {
				return true;
			}
		}
	}

	return false;
}

/**
 * description...
 * Date :
 *
 * @param strDate
 * @param toDate
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function checkDateCurrent(strDate) {
	if(!checkFormatDate(strDate)) {
		return false;
	}

	inputYear = getYearToInt(strDate);
	inputMonth = getMonthToInt(strDate);
	inputDate = getDateToInt(strDate);
	thisDate = new Date();
	currentDate = thisDate.getDate();
	currentMonth = thisDate.getMonth() + 1;
	currentYear = thisDate.getYear();
	if(inputYear > currentYear) {
		return true;
	}

	if(inputYear == currentYear) {
		if(currentMonth == inputMonth) {
			if(currentDate < inputDate) {
				return true;
			}
		} else {
			if(currentMonth < inputMonth) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Alert hot key to print according to client OS
 * Date : 2008
 *
 * @return none
 *
 * @author Bao.Tran
 * @since function available since version 1.0
 */
function printArticle() {
	var agt=navigator.userAgent.toLowerCase();
	if (window.print) {
		setTimeout('window.print();',200);
	}
	else if (agt.indexOf("mac") != -1) {
		alert("Press 'Cmd+p' on your keyboard to print article.");
	}
	else {
		alert("Press 'Ctrl+p' on your keyboard to print article.")
	}
}

var marked_row = new Array;
/**
 * Sets/unsets the pointer and marker in browse mode
 * Date :
 *
 * @param   object		theRow				the table row
 * @param   interger 	theRowNum			the the row number
 * @param   string   	thePointerColor	 	theDefaultColor the action calling this script (over, out or click)
 * @param   string   	thePointerColor		the default background color
 * @param   string    	thePointerColor		the color to use for mouseover
 * @param   string    	theMarkColor		the color to use for marking a row
 * @return  boolean  whether pointer is set or not
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function setPointer(theRow, theRowNum, theAction, theDefaultColor, thePointerColor, theMarkColor)
{
	var theCells = null;

	// 1. Pointer and mark feature are disabled or the browser can't get the
	//    row -> exits
	if ((thePointerColor == '' && theMarkColor == '')
			|| typeof(theRow.style) == 'undefined') {
		return false;
	}

	// 2. Gets the current row and exits if the browser can't get it
	if (typeof(document.getElementsByTagName) != 'undefined') {
		theCells = theRow.getElementsByTagName('td');
	}
	else if (typeof(theRow.cells) != 'undefined') {
		theCells = theRow.cells;
	}
	else {
		return false;
	}

	// 3. Gets the current color...
	var rowCellsCnt  = theCells.length;
	var domDetect    = null;
	var currentColor = null;
	var newColor     = null;
	// 3.1 ... with DOM compatible browsers except Opera that does not return
	//         valid values with "getAttribute"
	if (typeof(window.opera) == 'undefined'
		&& typeof(theCells[0].getAttribute) != 'undefined') {
		currentColor = theCells[0].getAttribute('bgcolor');
		domDetect    = true;
	}
	// 3.2 ... with other browsers
	else {
		currentColor = theCells[0].style.backgroundColor;
		domDetect    = false;
	} // end 3

	// 3.3 ... Opera changes colors set via HTML to rgb(r,g,b) format so fix it
	if (currentColor.indexOf("rgb") >= 0)
	{
		var rgbStr = currentColor.slice(currentColor.indexOf('(') + 1,
				currentColor.indexOf(')'));
		var rgbValues = rgbStr.split(",");
		currentColor = "#";
		var hexChars = "0123456789ABCDEF";
		for (var i = 0; i < 3; i++)
		{
			var v = rgbValues[i].valueOf();
			currentColor += hexChars.charAt(v/16) + hexChars.charAt(v%16);
		}
	}

	// 4. Defines the new color
	// 4.1 Current color is the default one
	if (currentColor == ''
		|| currentColor.toLowerCase() == theDefaultColor.toLowerCase()) {
		if (theAction == 'over' && thePointerColor != '') {
			newColor              = thePointerColor;
		}
		else if (theAction == 'click' && theMarkColor != '') {
			newColor              = theMarkColor;
			marked_row[theRowNum] = true;
			// Garvin: deactivated onclick marking of the checkbox because it's also executed
			// when an action (like edit/delete) on a single item is performed. Then the checkbox
			// would get deactived, even though we need it activated. Maybe there is a way
			// to detect if the row was clicked, and not an item therein...
			// document.getElementById('id_rows_to_delete' + theRowNum).checked = true;
		}
	}
	// 4.1.2 Current color is the pointer one
	else if (currentColor.toLowerCase() == thePointerColor.toLowerCase()
			&& (typeof(marked_row[theRowNum]) == 'undefined' || !marked_row[theRowNum])) {
		if (theAction == 'out') {
			newColor              = theDefaultColor;
		}
		else if (theAction == 'click' && theMarkColor != '') {
			newColor              = theMarkColor;
			marked_row[theRowNum] = true;
			// document.getElementById('id_rows_to_delete' + theRowNum).checked = true;
		}
	}
	// 4.1.3 Current color is the marker one
	else if (currentColor.toLowerCase() == theMarkColor.toLowerCase()) {
		if (theAction == 'click') {
			newColor              = (thePointerColor != '')
			? thePointerColor
					: theDefaultColor;
			marked_row[theRowNum] = (typeof(marked_row[theRowNum]) == 'undefined' || !marked_row[theRowNum])
			? true
					: null;
			// document.getElementById('id_rows_to_delete' + theRowNum).checked = false;
		}
	} // end 4

	// 5. Sets the new color...
	if (newColor) {
		var c = null;
		// 5.1 ... with DOM compatible browsers except Opera
		if (domDetect) {
			for (c = 0; c < rowCellsCnt; c++) {
				theCells[c].setAttribute('bgcolor', newColor, 0);
			} // end for
		}
		// 5.2 ... with other browsers
		else {
			for (c = 0; c < rowCellsCnt; c++) {
				theCells[c].style.backgroundColor = newColor;
			}
		}
	} // end 5

	return true;
} // end of the 'setPointer()' function

/**
 * description...
 * Date :
 *
 * @param date
 * @param month
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function kiemtrangay(date,month) {
	switch (month) {
		case '04':
		case '06':
		case '09':
		case '11':
			if(date > '30') {
				return 0;
			}
			break;
		case '02':
			if(date > '28') {
				return 0;
			}
			break;
	}
	return 1;
}
/**
 * description...
 * Date :
 *
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function kiemtrangaythangofsearch() {
	date=searchtin.ngay.options[searchtin.ngay.selectedIndex].value;
	if(date.length < 2) {
		date = "0" + date;
	}
	month = searchtin.thang.options[searchtin.thang.selectedIndex].value;
	if(month.length < 2) {
		month = "0" + month;
	}
	year=searchtin.nam.value;
	if(!kiemtrangay(date, month)) {
		alert("Date invalid, please select date again!");
		return;
	} else {
		searchtin.ketqua.value=year+"-"+month+"-"+date;
		if(date == "00") {
			searchtin.ketqua.value=year+"-"+month+"-";
			//alert(searchtin.ketqua.value);
		}
		document.searchtin.submit();
	}
}
//Ham nay dung kiem tra du lieu nhap vao co phai la so tu nhien. Neu du liep nhap vao la text thi se tu dong xoa text.
/**
 * description...
 * Date :
 *
 * @param number
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 */
function inputNumber(number) {
	var pattern = ".,0123456789";
	var len = number.value.length;

	if (len != 0) {
		var index = 0;

		while ((index < len) && (len != 0)) {
			if (pattern.indexOf(number.value.charAt(index)) == -1) {
				if (index == len - 1) {
					number.value = number.value.substring(0, len-1);
				} else if (index == 0) {
					number.value = number.value.substring(1, len);
				} else {
					number.value = number.value.substring(0, index)+number.value.substring(index+1, len);
				}
				index = 0;
				len = number.value.length;
			} else {
				index++;
			}
		}
	}
}

/**
 * Finds whether password is one of user information
 * Date : 2009
 *
 * @param string password string being evaluated
 * @param array userinfo information being compared with
 * @return boolean return true if password is none of user information, false otherwise
 *
 * @author Tri.Le <tri.le@vietunion.com.vn>
 * @since function available since version 1.0
 */
function checkPassword(password, userinfo) {
	/**
	 * No space allowed
	 */
	var pass1 = password.value.toUpperCase();
	var valid = false;
	//if password is too short
	if (pass1.length < 8) {
		//strerr = erPassword;
		return false;
	} else {
		if (pass1.match(' ')) {
			return false;
		}

		//if password is one of these infos
		if (pass1 == userinfo[0].toUpperCase()/** username*/
				|| pass1 == userinfo[1].toUpperCase()/** email*/
				|| pass1 == userinfo[2].toUpperCase()/** id card/passport*/
				|| pass1 == userinfo[4]) /** phone*/ {
			return false;
		} else {
			if (pass1.length == 8) {
				a = pass1.substring(4,8) + pass1.substring(2,4) + pass1.substring(0,2);

				if (a == userinfo[3]) {
					return false;
				}
			}
		}
	}

	return true;
	//END OF VALIDATE PASSWORD
}

/**
 * description...
 * Date :
 *
 * @param strDate
 * @return unknown_type
 *
 * @author Vuong.Ho <vuong.ho@vietunion.com.vn>
 * @since function available since version 1.0
 */
function checkDateTextbox(strDate) {
	if (strDate == 'dd/mm/yyyy') {
		return true;
	}

	var isDate = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4,4}$/;
	//if(strDate != "" && strDate.toLowerCase() != 'dd/mm/yyyy') {
	if (!isDate.test(strDate)) {
		return false;
	} else {
		var d = strDate.split("/");
		d[0] = parseInt(d[0],10);
		d[1] = parseInt(d[1],10);
		d[2] = parseInt(d[2],10);
		today = new Date();
		y = today.getFullYear();

		if (d[0] == 0 || d[1] == 0 || (d[2] < 1900 && d[2] > y)) {//if any part is 0 or year is out of range 1900 and current
			return false;
		} else {
			//month 1,3,5,7,8,10,12
			if (d[1] == 1 || d[1] == 3 || d[1] == 5 || d[1] == 7 || d[1] == 8 || d[1] == 10 || d[1] == 12) {
				if (d[0] > 31) {
					return false;
				}
				//month 4,6,9,11
			} else if (d[1] == 4 || d[1] == 6 || d[1] == 9 || d[1] == 11) {
				if (d[0] > 30) {
					return false;
				}
				//month 2
			} else if (d[1] == 2) {
				if (d[2] % 4 == 0) {
					if (d[0] > 29) {
						return false;
					}
				} else {
					if (d[0] > 28) {
						return false;
					}
				}
				//other month is invalid
			} else {
				return false;
			}
		}
	}
//}
	return true;
}

/**
 * Finds whether a string in URL format
 * Date : 2008
 *
 * @param string strURL string will be evaluated
 * @return boolean
 *
 * @author Tri.Le <tri.le@vietunion.com.vn>
 * @since function available since version 1.0
 */
function checkURL(strURL) {
	var url = /^(http|https)\:\/\/[a-z0-9\_\-]{2,}(\.[a-z0-9]{2,}){1,}$/i;
	return url.test(strURL);
}

/**
 * Finds whether a string in URL format
 * Date : 2013
 *
 * @param string strURL string will be evaluated
 * @return boolean
 *
 * @author Tuan.dap <tuan.dao@vietunion.com.vn>
 * @since function available since version 1.0
 */
function checkURLWebsiteICom(strURL) {
	var url = /^(http|https)\:\/\/[a-z0-9\_\-]{2,}(\.[a-z0-9]{2,}){1,}((\/)?([a-zA-Z0-9])*)*(\:[0-9]+)?$/i;
	return url.test(strURL);
}


/**
 * Check length in a textarea
 * Omitted over length (defined in textarea maxlength attribue) characters at the end of string
 * Date : 2008
 *
 * @param object textarea textarea to be checked
 * @return none
 *
 * @author Tri.Le <tri.le@vietunion.com.vn>
 * @since function available since version 1.0
 */
function checkinput(textarea) {
	var value = textarea.value;
	var maxlength = parseInt(textarea.getAttribute("maxlength"),10);

	if (value.length > maxlength) {
		textarea.value = textarea.value.substring(0,maxlength);
	}
	/*document.getElementById(textarea.name+'_leftChars').innerHTML = maxlength - textarea.value.length;*/
}

/*
 * Textarea Check characters special
 * Date: 2014
 *
 *  @author Tuan.Dao <tuan.dao@vietunion.com.vn>
 */
function checkinputReason(textarea) {
	var value = textarea.value;
	var maxlength = parseInt(textarea.getAttribute("maxlength"),10);
	var pattern = /[`~!@#$%^&*()_|+\-=?;:'"<>\{\}\[\]\\\/]/gi;
	if (value.match(pattern)) {
		textarea.value = value.replace(pattern,"");
	}

	if (value.length > maxlength) {
		textarea.value = textarea.value.substring(0,maxlength);
	}


	/*document.getElementById(textarea.name+'_leftChars').innerHTML = maxlength - textarea.value.length;*/
}

/**
 * Goes to other page
 * Date : 2008
 *
 * @param integer n
 * @param a
 * @return unknown_type
 *
 * @author Vuong.Ho <vuong.ho@vietunion.com.vn>
 * @since function available since version 1.0
 */
function Go(n, a){
	var frm = document.frmView;
	frm.page.value= n;
	frm.all.value= a;
	frm.submit();
}

/**
 * Checks all checkbox elements in a form
 * Date : 2009
 *
 * @param object obj exceptive objects
 * @param object fr form which elements will be checked
 * @return none
 *
 * @author Vuong.Ho <vuong.ho@vietunion.com.vn>
 * @since function available since version 1.0
 */
function setCheckedAll(obj, fr) {
	for (var i = 0; i < fr.elements.length; i++) {
		var e = fr.elements[i];
		if ((e.name != obj.name) && (e.type=='checkbox')) {
			e.checked = obj.checked;
		}
	}
}

/**
 * Clears a field value
 * Date : 2009
 *
 * @param object frm field will be clear value
 * @return none
 *
 * @author Vuong.Ho <vuong.ho@vietunion.com.vn>
 * @since function available since version 1.0
 */
function clear_fromdate(frm) {
	frm.value ='';
}

/**
 * Clears a field value
 * Date : 2009
 *
 * @param object frm field will be clear value
 * @return none
 *
 * @author Vuong.Ho <vuong.ho@vietunion.com.vn>
 * @since function available since version 1.0
 */
function clear_todate(frm) {
	frm.value ='';
}
/**
 * Compares two string date (in d/m/Y format)
 * Date : 2008
 *
 * @param string fdate date will be compared
 * @param string tdate date will be compared
 * @return boolean returns TRUE on fdate smaller than tdate, false otherwise
 *
 * @author Tri.Le <tri.le@vietunion.com.vn>
 * @since function available since version 1.0
 */
function CompareDates(fdate,tdate) {
	if (fdate == 'dd/mm/yyyy' && tdate == 'dd/mm/yyyy') {
		return true;
	}
	var f = fdate.split('/');
	var t = tdate.split('/');
	var fd = parseInt(f[2],10)*10000 + parseInt(f[1],10)*100 + parseInt(f[0],10);
	var td = parseInt(t[2],10)*10000 + parseInt(t[1],10)*100 + parseInt(t[0],10);

	if (td < fd) {
		return false;
	}

	return true;
}


/**
 * Finds whether a date is smaller or equal to current date
 * Date : 2008
 *
 * @param string fdate string date will be compared
 * @param boolean equal
 * @return boolean
 *
 * @author Vuong.Ho<vuong.ho@vietunion.com.vn>
 * @since function available since version 1.0
 */
function CompareDatesnow(fdate, equal) {
	if (fdate == "" || fdate == "dd/mm/yyyy") {
		return false;
	}

	var date = new Date();
	var d  = date.getDate();
	var m = date.getMonth() + 1;
	var yy = date.getFullYear();
	var n = yy + (m < 10?'0':'') + m + '' + (d<10?'0':'') + d;
	var dd = fdate.split("/");
	var fd = dd[2] + '' + (parseInt(dd[1],10) < 10?'0':'') + parseInt(dd[1],10) + '' + (parseInt(dd[0],10) < 10?'0':'') + parseInt(dd[0],10);

	if ((parseInt(fd,10) == parseInt(n,10)) && equal) {
		return false;
	}

	if (parseInt(fd,10) < parseInt(n,10)) {
		return false;
	}

	return true;
}

/**
 * Validates form in create, update Payme button
 * Date :
 *
 * @param object frm form will be validated
 * @return boolean
 *
 * @author
 * @since function available since version 1.0
 */
function submitForm(frm)
{
	if (frm.FromDate.value != "") {
		if (!checkDateTextbox(frm.FromDate.value)) {
			alert(msg115);
			frm.FromDate.focus();
			return false;
		}
	}

	if (frm.ToDate.value != "") {
		if (!checkDateTextbox(frm.ToDate.value)) {
			alert(msg115);
			frm.ToDate.focus();
			return false;
		}
	}

	if(CompareDatesnow(String(frm.FromDate.value),true)) {
		alert(msg113);
		return false;
	}

	if(CompareDates(String(frm.FromDate.value),String(frm.ToDate.value)) == false) {
		alert(msg114);
		return false;
	}

	return true;
}

/**
 * Concatenates selected SM checkboxes value in a list
 * Date : 2008
 *
 * @return string
 *
 * @author Vuong.Ho <vuong.ho@vietunion.com.vn>
 * @since function available since version 1.0
 */
function checkselect() {
	var sm = document.getElementById('sm').value;
	sm = new Array();
	str ='';
	if(frm.sm.length > 1) {
		for (var i=0; i < frm.sm.length; i++) {
			if (frm.sm[i].checked) {
				str += frm.sm[i].value +',';
			}
		}
	} else {
		sm = document.getElementById('sm').value;
		if(frm.sm.checked) {
			str += frm.sm.value +',';
		}
	}
	return 	str;

}

/**
 * Appends new handler to Body Onload event
 * Date : 2009
 *
 * @param function func function will be execute on onload event
 * @return none
 *
 * @author Nam.Nguyen <nam.nguyen@vietunion.com.vn>
 * @since function available since version 1.0
 */
function addLoadEvent(func) {
	var oldonload = window.onload;
	if (typeof window.onload != 'function') {
		window.onload = func;
	} else {
		window.onload = function() {
			oldonload();
			func();
		}
	}
}
/**
 * Builds all neccessary events, elements to display tooltip
 * Date : 2009
 *
 * @return none
 *
 * @author Nam.Nguyen <nam.nguyen@vietunion.com.vn>
 * @since function available since version 1.0s
 */
function prepareInputsForHints() {
	var inputs = document.getElementsByTagName("input");
	for (var i=0; i<inputs.length; i++){
		// test to see if the hint span exists first
		if (inputs[i].parentNode.getElementsByTagName("span")[0]) {
			// the span exists!  on focus, show the hint
			if (inputs[i].id == '')
			{
				inputs[i].setAttribute('id',inputs[i].name+i);
			}

			inputs[i].onfocus = function () {
				if (!this.parentNode.getElementsByTagName("input")[0].classList.contains('disabled')) {
					this.parentNode.getElementsByTagName("span")[0].style.display = "inline";
				}
			}
			// when the cursor moves away from the field, hide the hint
			if (getBrowserAgent() == 'IE')
			{
				inputs[i].attachEvent('onblur',function(evt) {evt['srcElement'].parentNode.getElementsByTagName("span")[0].style.display = "none";});
			}
			else
			{
				inputs[i].addEventListener('blur',function(){this.parentNode.getElementsByTagName("span")[0].style.display = "none";},false);
			}
		}
	}
	// repeat the same tests as above for selects
	var selects = document.getElementsByTagName("select");
	for (var k=0; k<selects.length; k++){
		if (selects[k].parentNode.getElementsByTagName("span")[0]) {
			selects[k].onfocus = function () {
				this.parentNode.getElementsByTagName("span")[0].style.display = "inline";
			}
			selects[k].onblur = function () {
				this.parentNode.getElementsByTagName("span")[0].style.display = "none";
			}
		}
	}
	var textareas = document.getElementsByTagName("textarea");
	for (var k=0; k<textareas.length; k++){
		if (textareas[k].parentNode.getElementsByTagName("span")[0]) {
			textareas[k].onfocus = function () {
				this.parentNode.getElementsByTagName("span")[0].style.display = "inline";
				sh = this.parentNode.getElementsByTagName("span")[0].clientHeight;
				ah = this.clientHeight;

				if (ah > sh)
					hp = (ah - sh)/2;
				else
					hp = 0;

				this.parentNode.getElementsByTagName("span")[0].style.marginTop = hp;
				if (getBrowserAgent() == 'FF')
					this.parentNode.getElementsByTagName("span")[0].style.marginLeft = 3;
			}
			textareas[k].onblur = function () {
				this.parentNode.getElementsByTagName("span")[0].style.display = "none";
			}
		}
	}
}
//addLoadEvent(prepareInputsForHints);
prepareInputsForHints();
/*---end tt--*/








/*-----keyboard----*/
/* ********************************************************************
 **********************************************************************
 * HTML Virtual Keyboard Interface Script - v1.10
 *   Copyright (c) 2008 - GreyWyvern
 *
 *  - Licenced for free distribution under the BSDL
 *          http://www.opensource.org/licenses/bsd-license.php
 *
 * Add a script-driven keyboard interface to text fields, password
 * fields and textareas.
 *
 * See http://www.greywyvern.com/code/js/keyboard.html for examples and
 * usage instructions.
 *
 * Version 1.10 - April 14, 2008
 *   - Slovenian keyboard layout added by Miran Zeljko
 *
 * Version 1.9 - April 3, 2008
 *   - Hungarian keyboard layout added by Antal Sall 'Hiromacu'
 *
 * Version 1.8 - March 31, 2008
 *   - Performance tweaks
 *
 * Version 1.7 - March 27, 2008
 *   - Arabic keyboard layout added by Srinivas Reddy
 *
 * Version 1.6 - January 16, 2008
 *   - Hebrew keyboard layout added by Enon Avital
 *
 * Version 1.5 - January 7, 2008
 *   - Italian and Spanish (Spain) keyboard layouts added by dictionarist.com
 *
 * Version 1.4a - October 15, 2007
 *   - Keyboard is fully removed from document when hidden
 *
 * Version 1.4 - August 1, 2007
 *   - Simplified layout syntax a bit
 *   - Added version number to lower right of interface
 *   - Various other small bug fixes
 *
 * Version 1.3 - July 30, 2007
 *   - Interaction styling changes (Alt, AltGr, Shift)
 *   - Justified keys - last key expands to fit width
 *   - If no dead keys in layout, dead key checkbox is hidden
 *   - Option to disable dead keys per keyboard
 *   - Added the Number Pad layout
 *   - Pulled all variations of script up to same version number
 *
 * Keyboard Credits
 *   - Slovenian keyboard layout added by Miran Zeljko
 *   - Hungarian keyboard layout added by Antal Sall 'Hiromacu'
 *   - Arabic keyboard layout added by Srinivas Reddy
 *   - Italian and Spanish (Spain) keyboard layouts added by dictionarist.com
 *   - Lithuanian and Russian keyboard layouts added by Ramunas
 *   - German keyboard layout added by QuHno
 *   - French keyboard layout added by Hidden Evil
 *   - Polish Programmers layout assisted by moose
 *   - Turkish keyboard layouts added by offcu
 *   - Dutch and US Int'l keyboard layouts assisted by jerone
 *   - Portuguese keyboard layout added by clisboa
 *
 */

function VKI_buildKeyboardInputs() {
	var self = this;

	this.VKI_version = "ietunion";
	this.VKI_target = this.VKI_visible = "";
	this.VKI_shift = this.VKI_capslock = this.VKI_alternate = this.VKI_dead = false;
	this.VKI_deadkeysOn = false;
	this.VKI_kt = "US";  // Default keyboard layout
	this.VKI_range = false;
	this.VKI_keyCenter = 3;


	/* ***** Create keyboards **************************************** */
	this.VKI_layout = new Object();
	this.VKI_layoutDDK = new Object();

	// - Lay out each keyboard in rows of sub-arrays.  Each sub-array
	//   represents one key.
	//
	// - Each sub-array consists of four slots described as follows:
	//     example: ["a", "A", "\u00e1", "\u00c1"]
	//
	//          a) Normal character
	//          A) Character + Shift or Caps
	//     \u00e1) Character + Alt or AltGr
	//     \u00c1) Character + Shift or Caps + Alt or AltGr
	//
	//   You may include sub-arrays which are fewer than four slots.  In
	//   these cases, the missing slots will be blanked when the
	//   corresponding modifier key (Shift or AltGr) is pressed.
	//
	// - If the second slot of a sub-array matches one of the following
	//   strings:
	//       "Tab", "Caps", "Shift", "Enter", "Bksp", "Alt" OR "AltGr"
	//   then the function of the key will be the following,
	//   respectively:
	//     - Insert a tab
	//     - Toggle Caps Lock (technically a Shift Lock)
	//     - Next entered character will be the shifted character
	//     - Insert a newline (textarea), or close the keyboard
	//     - Delete the previous character
	//     - Next entered character will be the alternate character
	//
	//   The first slot of this sub-array will be the text to display on
	//   the corresponding key.  This allows for easy localisation of key
	//   names.
	//
	// - Layout dead keys (diacritic + letter) should be added as arrays
	//   of two item arrays with hash keys equal to the diacritic.  See
	//   the "this.VKI_deadkey" object below the layout definitions. In
	//   each two item child array, the second item is what the diacritic
	//   would change the first item to.
	//
	// - To disable dead keys for a layout, simply assign true to the
	//   this.VKI_layoutDDK (DDK = disable dead keys) object of the same
	//   name as the layout.  See the Numpad layout below for an example.
	//
	// - Note that any characters beyond the normal ASCII set should be
	//   entered in escaped Unicode format.  (eg \u00a3 = Pound symbol)
	//   You can find Unicode values for characters here:
	//     http://unicode.org/charts/
	//
	// - To remove a keyboard, just delete it, or comment it out of the
	//   source code

	this.VKI_layout.Arabic = [ // Arabic Keyboard
	                           [["\u0630", "\u0651 "], ["1", "!", "\u00a1", "\u00b9"], ["2", "@", "\u00b2"], ["3", "#", "\u00b3"], ["4", "$", "\u00a4", "\u00a3"], ["5", "%", "\u20ac"], ["6", "^", "\u00bc"], ["7", "&", "\u00bd"], ["8", "*", "\u00be"], ["9", "(", "\u2018"], ["0", ")", "\u2019"], ["-", "_", "\u00a5"], ["=", "+", "\u00d7", "\u00f7"], ["Bksp", "Bksp"]],
	                           [["Tab", "Tab"], ["\u0636", "\u064e"], ["\u0635", "\u064b"], ["\u062b", "\u064f"], ["\u0642", "\u064c"], ["\u0641", "\u0644"], ["\u063a", "\u0625"], ["\u0639", "\u2018"], ["\u0647", "\u00f7"], ["\u062e", "\u00d7"], ["\u062d", "\u061b"], ["\u062c", "\u003c"], ["\u062f", "\u003e"], ["\u005c", "\u007c"]],
	                           [["Caps", "Caps"], ["\u0634", "\u0650"], ["\u0633", "\u064d"], ["\u064a", "\u005d"], ["\u0628", "\u005b"], ["\u0644", "\u0644"], ["\u0627", "\u0623"], ["\u062a", "\u0640"], ["\u0646", "\u060c"], ["\u0645", "\u002f"], ["\u0643", "\u003a"], ["\u0637", "\u0022"], ["Enter", "Enter"]],
	                           [["Shift", "Shift"], ["\u0626", "\u007e"], ["\u0621", "\u0652"], ["\u0624", "\u007d"], ["\u0631", "\u007b"], ["\u0644", "\u0644"], ["\u0649", "\u0622"], ["\u0629", "\u2019"], ["\u0648", "\u002c"], ["\u0632", "\u002e"], ["\u0638", "\u061f"], ["Shift", "Shift"]],
	                           [[" ", " ", " ", " "], ["Alt", "Alt"]]
	                            ];

	this.VKI_layout.Belgian = [ // Belgian Standard Keyboard
	                            [["\u00b2", "\u00b3"], ["&", "1", "|"], ["\u00e9", "2", "@"], ['"', "3", "#"], ["'", "4"], ["(", "5"], ["\u00a7", "6", "^"], ["\u00e8", "7"], ["!", "8"], ["\u00e7", "9", "{"], ["\u00e0", "0", "}"], [")", "\u00b0"], ["-", "_"], ["Bksp", "Bksp"]],
	                            [["Tab", "Tab"], ["a", "A"], ["z", "Z"], ["e", "E", "\u20ac"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"], ["\u005e", "\u00a8", "["], ["$", "*", "]"], ["Enter", "Enter"]],
	                            [["Caps", "Caps"], ["q", "Q"], ["s", "S"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], ["m", "M"], ["\u00f9", "%", "\u00b4"], ["\u03bc", "\u00a3", "`"]],
	                            [["Shift", "Shift"], ["<", ">", "\\"], ["w", "W"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], [",", "?"], [";", "."], [":", "/"], ["=", "+", "~"], ["Shift", "Shift"]],
	                            [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
	                             ];

	this.VKI_layout.Dutch = [ // Dutch Standard Keyboard
	                          [["@", "\u00a7", "\u00ac"], ["1", "!", "\u00b9"], ["2", '"', "\u00b2"], ["3", "#", "\u00b3"], ["4", "$", "\u00bc"], ["5", "%", "\u00bd"], ["6", "&", "\u00be"], ["7", "_", "\u00a3"], ["8", "(", "{"], ["9", ")", "}"], ["0", "'"], ["/", "?", "\\"], ["\u00b0", "~", "\u00b8"], ["Bksp", "Bksp"]],
	                          [["Tab", "Tab"], ["q", "Q"], ["w", "W"], ["e", "E", "\u20ac"], ["r", "R", "\u00b6"], ["t", "T"], ["y", "Y"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"], ["\u00a8", "^"], ["*", "|"], ["<", ">"]],
	                          [["Caps", "Caps"], ["a", "A"], ["s", "S", "\u00df"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], ["+", "\u00b1"], ["\u00b4", "\u0060"], ["Enter", "Enter"]],
	                          [["Shift", "Shift"], ["]", "[", "\u00a6"], ["z", "Z", "\u00ab"], ["x", "X", "\u00bb"], ["c", "C", "\u00a2"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M", "\u00b5"], [",", ";"], [".", ":", "\u00b7"], ["-", "="], ["Shift", "Shift"]],
	                          [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
	                           ];

	this.VKI_layout.Dvorak = [ // Dvorak Keyboard
	                           [["`", "~"], ["1", "!"], ["2", "@"], ["3", "#"], ["4", "$"], ["5", "%"], ["6", "^"], ["7", "&"], ["8", "*"], ["9", "("], ["0", ")"], ["[", "{"], ["]", "}"], ["Bksp", "Bksp"]],
	                           [["Tab", "Tab"],["'", '"'], [",", "<"], [".", ">"], ["p", "P"], ["y", "Y"], ["f", "F"], ["g", "G"], ["c", "C"], ["r", "R"], ["l", "L"], ["/", "?"], ["=", "+"], ["\\", "|"]],
	                           [["Caps", "Caps"], ["a", "A"], ["o", "O"], ["e", "E"], ["u", "U"], ["i", "I"], ["d", "D"], ["h", "H"], ["t", "T"], ["n", "N"], ["s", "S"], ["-", "_"], ["Enter", "Enter"]],
	                           [["Shift", "Shift"], [";", ":"], ["q", "Q"], ["j", "J"], ["k", "K"], ["x", "X"], ["b", "B"], ["m", "M"], ["w", "W"], ["v", "V"], ["z", "Z"], ["Shift", "Shift"]],
	                           [[" ", " "]]
	                            ];

	this.VKI_layout.French = [ // French Standard Keyboard
	                           [["\u00b2", "\u00b3"], ["&", "1"], ["\u00e9", "2", "~"], ['"', "3", "#"], ["'", "4", "{"], ["(", "5", "["], ["-", "6", "|"], ["\u00e8", "7", "\u0060"], ["_", "8", "\\"], ["\u00e7", "9", "\u005e"], ["\u00e0", "0", "\u0040"], [")", "\u00b0", "]"], ["=", "+", "}"], ["Bksp", "Bksp"]],
	                           [["Tab", "Tab"], ["a", "A"], ["z", "Z"], ["e", "E", "\u20ac"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"], ["^", "\u00a8"], ["$", "\u00a3", "\u00a4"], ["Enter", "Enter"]],
	                           [["Caps", "Caps"], ["q", "Q"], ["s", "S"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], ["m", "M"], ["\u00f9", "%"], ["*", "\u03bc"]],
	                           [["Shift", "Shift"], ["<", ">"], ["w", "W"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], [",", "?"], [";", "."], [":", "/"], ["!", "\u00a7"], ["Shift", "Shift"]],
	                           [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
	                            ];

	this.VKI_layout.German = [ // German Standard Keyboard
	                           [["\u005e", "\u00b0"], ["1", "!"], ["2", '"', "\u00b2"], ["3", "\u00a7", "\u00b3"], ["4", "$"], ["5", "%"], ["6", "&"], ["7", "/", "{"], ["8", "(", "["], ["9", ")", "]"], ["0", "=", "}"], ["\u00df", "?", "\\"], ["\u00b4", "\u0060"], ["Bksp", "Bksp"]],
	                           [["Tab", "Tab"], ["q", "Q", "\u0040"], ["w", "W"], ["e", "E", "\u20ac"], ["r", "R"], ["t", "T"], ["z", "Z"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"], ["\u00fc", "\u00dc"], ["+", "*", "~"], ["Enter", "Enter"]],
	                           [["Caps", "Caps"], ["a", "A"], ["s", "S"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], ["\u00f6", "\u00d6"], ["\u00e4", "\u00c4"], ["#", "'"]],
	                           [["Shift", "Shift"], ["<", ">", "\u00a6"], ["y", "Y"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M", "\u00b5"], [",", ";"], [".", ":"], ["-", "_"], ["Shift", "Shift"]],
	                           [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
	                            ];

	this.VKI_layout.Greek = [ // Greek Standard Keyboard
	                          [["`", "~"], ["1", "!"], ["2", "@", "\u00b2"], ["3", "#", "\u00b3"], ["4", "$", "\u00a3"], ["5", "%", "\u00a7"], ["6", "^", "\u00b6"], ["7", "&"], ["8", "*", "\u00a4"], ["9", "(", "\u00a6"], ["0", ")", "\u00ba"], ["-", "_", "\u00b1"], ["=", "+", "\u00bd"], ["Bksp", "Bksp"]],
	                          [["Tab", "Tab"], [";", ":"], ["\u03c2", "^"], ["\u03b5", "\u0395"], ["\u03c1", "\u03a1"], ["\u03c4", "\u03a4"], ["\u03c5", "\u03a5"], ["\u03b8", "\u0398"], ["\u03b9", "\u0399"], ["\u03bf", "\u039f"], ["\u03c0", "\u03a0"], ["[", "{", "\u201c"], ["]", "}", "\u201d"], ["Enter", "Enter"]],
	                          [["Caps", "Caps"], ["\u03b1", "\u0391"], ["\u03c3", "\u03a3"], ["\u03b4", "\u0394"], ["\u03c6", "\u03a6"], ["\u03b3", "\u0393"], ["\u03b7", "\u0397"], ["\u03be", "\u039e"], ["\u03ba", "\u039a"], ["\u03bb", "\u039b"], ["\u0384", "\u00a8", "\u0385"], ["'", '"'], ["\\", "|", "\u00ac"]],
	                          [["Shift", "Shift"], ["<", ">"], ["\u03b6", "\u0396"], ["\u03c7", "\u03a7"], ["\u03c8", "\u03a8"], ["\u03c9", "\u03a9"], ["\u03b2", "\u0392"], ["\u03bd", "\u039d"], ["\u03bc", "\u039c"], [",", "<"], [".", ">"], ["/", "?"], ["Shift", "Shift"]],
	                          [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
	                           ];

	this.VKI_layout.Hebrew = [ // Hebrew Standard Keyboard
	                           [["~", "`"], ["1", "!"], ["2", "@"], ["3", "#"], ["4" , "$", "\u20aa"], ["5" , "%"], ["6", "^"], ["7", "&"], ["8", "*"], ["9", ")"], ["0", "("], ["-", "_"], ["=", "+"], ["\\", "|"], ["Bksp", "Bksp"]],
	                           [["Tab", "Tab"], ["/", "Q"], ["'", "W"], ["\u05e7", "E", "\u20ac"], ["\u05e8", "R"], ["\u05d0", "T"], ["\u05d8", "Y"], ["\u05d5", "U", "\u05f0"], ["\u05df", "I"], ["\u05dd", "O"], ["\u05e4", "P"], ["]", "}"], ["[", "{"]],
	                           [["Caps", "Caps"], ["\u05e9", "A"], ["\u05d3", "S"], ["\u05d2", "D"], ["\u05db", "F"], ["\u05e2", "G"], ["\u05d9", "H", "\u05f2"], ["\u05d7", "J", "\u05f1"], ["\u05dc", "K"], ["\u05da", "L"], ["\u05e3", ":"], ["," , '"'], ["Enter", "Enter"]],
	                           [["Shift", "Shift"], ["\u05d6", "Z"], ["\u05e1", "X"], ["\u05d1", "C"], ["\u05d4", "V"], ["\u05e0", "B"], ["\u05de", "N"], ["\u05e6", "M"], ["\u05ea", ">"], ["\u05e5", "<"], [".", "?"], ["Shift", "Shift"]],
	                           [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
	                            ];

	this.VKI_layout.Hungarian = [ // Hungarian Standard Keyboard
	                              [["0", "\u00a7"], ["1", "'", "\u007e"], ["2", '"', "\u02c7"], ["3", "+", "\u02c6"], ["4", "!", "\u02d8"], ["5", "%", "\u00b0"], ["6", "/", "\u02db"], ["7", "=", "\u0060"], ["8", "(", "\u02d9"], ["9", ")", "\u00b4"], ["\u00f6", "\u00d6", "\u02dd"], ["\u00fc", "\u00dc", "\u00a8"], ["\u00f3", "\u00d3", "\u00b8"], ["Bksp", "Bksp"]],
	                              [["Tab", "Tab"], ["q", "Q", "\u005c"], ["w", "W", "\u007c"], ["e", "E", "\u00c4"], ["r", "R"], ["t", "T"], ["z", "Z"], ["u", "U", "\u20ac"], ["i", "I", "\u00cd"], ["o", "O"], ["p", "P"], ["\u0151", "\u0150", "\u00f7"], ["\u00fa", "\u00da", "\u00d7"], ["Enter", "Enter"]],
	                              [["Caps", "Caps"], ["a", "A", "\u00e4"], ["s", "S","\u0111"], ["d", "D","\u0110"], ["f", "F","\u005b"], ["g", "G","\u005d"], ["h", "H"], ["j", "J","\u00ed"], ["k", "K","\u0141"], ["l", "L","\u0142"], ["\u00e9", "\u00c9","\u0024"], ["\u00e1", "\u00c1","\u00df"], ["\u0171", "\u0170","\u00a4"]],
	                              [["Shift", "Shift"], ["\u00ed", "\u00cd","\u003c"], ["y", "Y","\u003e"], ["x", "X","\u0023"], ["c", "C","\u0026"], ["v", "V","\u0040"], ["b", "B","\u007b"], ["n", "N","\u007d"], ["m", "M","\u003c"], [",", "?","\u003b"], [".", ":","\u003e"], ["-", "_","\u002a"], ["Shift", "Shift"]],
	                              [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
	                               ];

	this.VKI_layout.Italian = [ // Italian Standard Keyboard
	                            [["\u005c", "\u007c"], ["1", "!"], ["2", '"'], ["3", "\u00a3"], ["4", "$", "\u20ac"], ["5", "%"], ["6", "&"], ["7", "/"], ["8", "("], ["9", ")"], ["0", "="], ["'", "?"], ["\u00ec", "\u005e"], ["Bksp", "Bksp"]],
	                            [["Tab", "Tab"], ["q", "Q"], ["w", "W"], ["e", "E", "\u20ac"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"], ["\u00e8", "\u00e9", "[", "{"], ["+", "*", "]", "}"], ["Enter", "Enter"]],
	                            [["Caps", "Caps"], ["a", "A"], ["s", "S"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], ["\u00f2", "\u00e7", "@"], ["\u00e0", "\u00b0", "#"], ["\u00f9", "\u00a7"]],
	                            [["Shift", "Shift"], ["<", ">"], ["z", "Z"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M"], [",", ";"], [".", ":"], ["-", "_"], ["Shift", "Shift"]],
	                            [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
	                             ];

	this.VKI_layout.Lithuanian = [ // Lithuanian Standard Keyboard
	                               [["`", "~"], ["\u0105", "\u0104"], ["\u010D", "\u010C"], ["\u0119", "\u0118"], ["\u0117", "\u0116"], ["\u012F", "\u012E"], ["\u0161", "\u0160"], ["\u0173", "\u0172"], ["\u016B", "\u016A"], ["\u201E", "("], ["\u201C", ")"], ["-", "_"], ["\u017E", "\u017D"], ["Bksp", "Bksp"]],
	                               [["Tab", "Tab"], ["q", "Q"], ["w", "W"], ["e", "E"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"], ["[", "{"], ["]", "}"], ["Enter", "Enter"]],
	                               [["Caps", "Caps"], ["a", "A"], ["s", "S"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], [";", ":"], ["'", '"'], ["\\", "|"]],
	                               [["Shift", "Shift"], ["\u2013", "\u20AC"], ["z", "Z"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M"], [",", "<"], [".", ">"], ["/", "?"], ["Shift", "Shift"]],
	                               [[" ", " "]]
	                                ];

	this.VKI_layout.Norwegian = [ // Norwegian Standard Keyboard
	                              [["|", "\u00a7"], ["1", "!"], ["2", '"', "@"], ["3", "#", "\u00a3"], ["4", "\u00a4", "$"], ["5", "%"], ["6", "&"], ["7", "/", "{"], ["8", "(", "["], ["9", ")", "]"], ["0", "=", "}"], ["+", "?"], ["\\", "`", "\u00b4"], ["Bksp", "Bksp"]],
	                              [["Tab", "Tab"], ["q", "Q"], ["w", "W"], ["e", "E", "\u20ac"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"], ["\u00e5", "\u00c5"], ["\u00a8", "^", "~"], ["Enter", "Enter"]],
	                              [["Caps", "Caps"], ["a", "A"], ["s", "S"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], ["\u00f8", "\u00d8"], ["\u00e6", "\u00c6"], ["'", "*"]],
	                              [["Shift", "Shift"], ["<", ">"], ["z", "Z"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M", "\u03bc", "\u039c"], [",", ";"], [".", ":"], ["-", "_"], ["Shift", "Shift"]],
	                              [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
	                               ];

	this.VKI_layout.Numpad = [ // Number pad
	                           [["$"], ["\u00a3"], ["\u20ac"], ["\u00a5"], ["/"], ["^"], ["Bksp", "Bksp"]],
	                           [["."], ["7"], ["8"], ["9"], ["*"], ["<"], ["("], ["["]],
	                           [["="], ["4"], ["5"], ["6"], ["-"], [">"], [")"], ["]"]],
	                           [["0"], ["1"], ["2"], ["3"], ["+"], ["Enter", "Enter"]],
	                           [[" "]]
	                            ];
	this.VKI_layoutDDK.Numpad = true;

	this.VKI_layout["Polish Prog"] = [ // Polish Programmers Keyboard
	                                   [["`", "~"], ["1", "!"], ["2", "@"], ["3", "#"], ["4", "$"], ["5", "%"], ["6", "^"], ["7", "&"], ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], ["Bksp", "Bksp"]],
	                                   [["Tab", "Tab"], ["q", "Q"], ["w", "W"], ["e", "E", "\u0119", "\u0118"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["i", "I"], ["o", "O", "\u00f3", "\u00d3"], ["p", "P"], ["[", "{"], ["]", "}"], ["\\", "|"]],
	                                   [["Caps", "Caps"], ["a", "A", "\u0105", "\u0104"], ["s", "S", "\u015b", "\u015a"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L", "\u0142", "\u0141"], [";", ":"], ["'", '"'], ["Enter", "Enter"]],
	                                   [["Shift", "Shift"], ["z", "Z", "\u017c", "\u017b"], ["x", "X", "\u017a", "\u0179"], ["c", "C", "\u0107", "\u0106"], ["v", "V"], ["b", "B"], ["n", "N", "\u0144", "\u0143"], ["m", "M"], [",", "<"], [".", ">"], ["/", "?"], ["Shift", "Shift"]],
	                                   [[" ", " ", " ", " "], ["Alt", "Alt"]]
	                                    ];

	this.VKI_layout.Portuguese = [ // Portuguese Standard Keyboard
	                               [["`", "\u00ac", "\u00a6"], ["1", "!"], ["2", '"'], ["3", "\u00a3"], ["4", "$", "\u20ac"], ["5", "%"], ["6", "^"], ["7", "&"], ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], ["Bksp", "Bksp"]],
	                               [["Tab", "Tab"], ["q", "Q"], ["w", "W"], ["e", "E", "\u00e9", "\u00c9"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U", "\u00fa", "\u00da"], ["i", "I", "\u00ed", "\u00cd"], ["o", "O", "\u00f3", "\u00d3"], ["p", "P"], ["[", "{"], ["]", "}"], ["Enter", "Enter"]],
	                               [["Caps", "Caps"], ["a", "A", "\u00e1", "\u00c1"], ["s", "S"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], ["\u00e7", "\u00c7"], [";", ":"], ["'", "@"], ["#", "~"]],
	                               [["Shift", "Shift"], ["\\", "|"], ["z", "Z"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M"], [",", "<"], [".", ">"], ["/", "?"], ["Shift", "Shift"]],
	                               [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
	                                ];

	this.VKI_layout.Russian = [ // Russian Standard Keyboard
	                            [["\u0451", "\u0401"], ["1", "!"], ["2", '"'], ["3", "\u2116"], ["4", ";"], ["5", "%"], ["6", ":"], ["7", "?"], ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], ["Bksp", "Bksp"]],
	                            [["Tab", "Tab"], ["\u0439", "\u0419"], ["\u0446", "\u0426"], ["\u0443", "\u0423"], ["\u043A", "\u041A"], ["\u0435", "\u0415"], ["\u043D", "\u041D"], ["\u0433", "\u0413"], ["\u0448", "\u0428"], ["\u0449", "\u0429"], ["\u0437", "\u0417"], ["\u0445", "\u0425"], ["\u044A", "\u042A"], ["Enter", "Enter"]],
	                            [["Caps", "Caps"], ["\u0444", "\u0424"], ["\u044B", "\u042B"], ["\u0432", "\u0412"], ["\u0430", "\u0410"], ["\u043F", "\u041F"], ["\u0440", "\u0420"], ["\u043E", "\u041E"], ["\u043B", "\u041B"], ["\u0434", "\u0414"], ["\u0436", "\u0416"], ["\u044D", "\u042D"], ["\\", "/"]],
	                            [["Shift", "Shift"], ["/", "|"], ["\u044F", "\u042F"], ["\u0447", "\u0427"], ["\u0441", "\u0421"], ["\u043C", "\u041C"], ["\u0438", "\u0418"], ["\u0442", "\u0422"], ["\u044C", "\u042C"], ["\u0431", "\u0411"], ["\u044E", "\u042E"], [".", ","], ["Shift", "Shift"]],
	                            [[" ", " "]]
	                             ];

	this.VKI_layout.Slovenian = [ // Slovenian Standard Keyboard
	                              [["\u00a8", "\u00a8", "\u00b8"], ["1", "!", "~"], ["2", '"', "\u02c7"], ["3", "#", "^"], ["4", "$", "\u02d8"], ["5", "%", "\u00b0"], ["6", "&", "\u02db"], ["7", "/", "\u0060"], ["8", "(", "\u00B7"], ["9", ")", "\u00b4"], ["0", "=", "\u2033"], ["'", "?", "\u00a8"], ["+", "*", "\u00b8"], ["Bksp", "Bksp"]],
	                              [["Tab", "Tab"], ["q", "Q", "\\"], ["w", "W","|"], ["e", "E", "\u20ac"], ["r", "R"], ["t", "T"], ["z", "Z"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"], ["\u0161", "\u0160", "\u00f7"], ["\u0111", "\u0110", "\u00d7"], ["Enter", "Enter"]],
	                              [["Caps", "Caps"], ["a", "A"], ["s", "S"], ["d", "D"], ["f", "F", "["], ["g", "G", "]"], ["h", "H"], ["j", "J"], ["k", "K", "\u0142"], ["l", "L", "\u0141"], ["\u010D", "\u010C"], ["\u0107", "\u0106", "\u00df"], ["\u017E", "\u017D", "\u00a4"]],
	                              [["Shift", "Shift"], ["<", ">"], ["y", "Y"], ["x", "X"], ["c", "C"], ["v", "V", "@"], ["b", "B", "{",], ["n", "N", "}"], ["m", "M", "\u00a7"], [",", ";"], [".", ":"], ["-", "_"], ["Shift", "Shift"]],
	                              [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
	                               ];

	this.VKI_layout["Spanish-SP"] = [ // Spanish (Spain) Standard Keyboard
	                                  [["\u00ba", "\u00aa", "\\"], ["1", "!", "|"], ["2", '"', "@"], ["3", "'", "#"], ["4", "$", "~"], ["5", "%", "\u20ac"], ["6", "&","\u00ac"], ["7", "/"], ["8", "("], ["9", ")"], ["0", "="], ["'", "?"], ["\u00a1", "\u00bf"], ["Bksp", "Bksp"]],
	                                  [["Tab", "Tab"], ["q", "Q"], ["w", "W"], ["e", "E"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"], ["\u0060", "^", "["], ["\u002b", "\u002a", "]"], ["Enter", "Enter"]],
	                                  [["Caps", "Caps"], ["a", "A"], ["s", "S"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], ["\u00f1", "\u00d1"], ["\u00b4", "\u00a8", "{"], ["\u00e7", "\u00c7", "}"]],
	                                  [["Shift", "Shift"], ["<", ">"], ["z", "Z"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M"], [",", ";"], [".", ":"], ["-", "_"], ["Shift", "Shift"]],
	                                  [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
	                                   ];

	this.VKI_layout["Turkish-F"] = [ // Turkish F Keyboard Layout
	                                 [['+', "*", "\u00ac"], ["1", "!", "\u00b9", "\u00a1"], ["2", '"', "\u00b2"], ["3", "^", "#", "\u00b3"], ["4", "$", "\u00bc", "\u00a4"], ["5", "%", "\u00bd"], ["6", "&", "\u00be"], ["7", "'", "{"], ["8", "(", '['], ["9", ")", ']'], ["0", "=", "}"], ["/", "?", "\\", "\u00bf"], ["-", "_", "|"], ["Bksp", "Bksp"]],
	                                 [["Tab", "Tab"], ["f", "F", "@"], ["g", "G"], ["\u011f", "\u011e"], ["\u0131", "\u0049", "\u00b6", "\u00ae"], ["o", "O"], ["d", "D", "\u00a5"], ["r", "R"], ["n", "N"], ["h", "H", "\u00f8", "\u00d8"], ["p", "P", "\u00a3"], ["q", "Q", "\u00a8"], ["w", "W", "~"], ["Enter", "Enter"]],
	                                 [["Caps", "Caps"], ["u", "U", "\u00e6", "\u00c6"], ["i", "\u0130", "\u00df", "\u00a7"], ["e", "E", "\u20ac"], ["a", "A", " ", "\u00aa"], ["\u00fc", "\u00dc"], ["t", "T"], ["k", "K"], ["m", "M"], ["l", "L"], ["y", "Y", "\u00b4"], ["\u015f", "\u015e"], ["x", "X", "`"]],
	                                 [["Shift", "Shift"], ["<", ">", "|", "\u00a6"], ["j", "J", "\u00ab", "<"], ["\u00f6", "\u00d6", "\u00bb", ">"], ["v", "V", "\u00a2", "\u00a9"], ["c", "C"], ["\u00e7", "\u00c7"], ["z", "Z"], ["s", "S", "\u00b5", "\u00ba"], ["b", "B", "\u00d7"], [".", ":", "\u00f7"], [",", ";", "-"], ["Shift", "Shift"]],
	                                 [[" ", " ", " ", " "],  ["AltGr", "AltGr"]]
	                                  ];

	this.VKI_layout["Turkish-Q"] = [ // Turkish Q Keyboard Layout
	                                 [['"', "\u00e9", "<"], ["1", "!", ">"], ["2", "'", "\u00a3"], ["3", "^", "#"], ["4", "+", "$"], ["5", "%", "\u00bd"], ["6", "&"], ["7", "/", "{"], ["8", "(", '['], ["9", ")", ']'], ["0", "=", "}"], ["*", "?", "\\"], ["-", "_", "|"], ["Bksp", "Bksp"]],
	                                 [["Tab", "Tab"], ["q", "Q", "@"], ["w", "W"], ["e", "E", "\u20ac"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["\u0131", "\u0049", "\u0069", "\u0130"], ["o", "O"], ["p", "P"], ["\u011f", "\u011e", "\u00a8"], ["\u00fc", "\u00dc", "~"], ["Enter", "Enter"]],
	                                 [["Caps", "Caps"], ["a", "A", "\u00e6", "\u00c6"], ["s", "S", "\u00df"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], ["\u015f", "\u015e", "\u00b4"], ["\u0069", "\u0130"], [",", ";", "`"]],
	                                 [["Shift", "Shift"], ["<", ">", "|"], ["z", "Z"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M"], ["\u00f6", "\u00d6"], ["\u00e7", "\u00c7"], [".", ":"], ["Shift", "Shift"]],
	                                 [[" ", " ", " ", " "],  ["AltGr", "AltGr"]]
	                                  ];

	this.VKI_layout.UK = [ // UK Standard Keyboard
	                       [["`", "\u00ac", "\u00a6"], ["1", "!"], ["2", '"'], ["3", "\u00a3"], ["4", "$", "\u20ac"], ["5", "%"], ["6", "^"], ["7", "&"], ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], ["Bksp", "Bksp"]],
	                       [["Tab", "Tab"], ["q", "Q"], ["w", "W"], ["e", "E", "\u00e9", "\u00c9"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U", "\u00fa", "\u00da"], ["i", "I", "\u00ed", "\u00cd"], ["o", "O", "\u00f3", "\u00d3"], ["p", "P"], ["[", "{"], ["]", "}"], ["Enter", "Enter"]],
	                       [["Caps", "Caps"], ["a", "A", "\u00e1", "\u00c1"], ["s", "S"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], [";", ":"], ["'", "@"], ["#", "~"]],
	                       [["Shift", "Shift"], ["\\", "|"], ["z", "Z"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M"], [",", "<"], [".", ">"], ["/", "?"], ["Shift", "Shift"]],
	                       [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
	                        ];

	this.VKI_layout.US = [ // US Standard Keyboard
	                       [["`", "~"], ["1", "!"], ["2", "@"], ["3", "#"], ["4", "$"], ["5", "%"], ["6", "^"], ["7", "&"], ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], ["Bksp", "Bksp"]],
	                       [["Tab", "Tab"], ["q", "Q"], ["w", "W"], ["e", "E"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"], ["[", "{"], ["]", "}"], ["\\", "|"]],
	                       [["Caps", "Caps"], ["a", "A"], ["s", "S"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], [";", ":"], ["'", '"'], ["Enter", "Enter"]],
	                       [["Shift", "Shift"], ["z", "Z"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M"], [",", "<"], [".", ">"], ["/", "?"], ["Shift", "Shift"]],
	                       [[" ", " "]]
	                        ];

	this.VKI_layout["US Int'l"] = [ // US International Keyboard
	                                [["`", "~"], ["1", "!", "\u00a1", "\u00b9"], ["2", "@", "\u00b2"], ["3", "#", "\u00b3"], ["4", "$", "\u00a4", "\u00a3"], ["5", "%", "\u20ac"], ["6", "^", "\u00bc"], ["7", "&", "\u00bd"], ["8", "*", "\u00be"], ["9", "(", "\u2018"], ["0", ")", "\u2019"], ["-", "_", "\u00a5"], ["=", "+", "\u00d7", "\u00f7"], ["Bksp", "Bksp"]],
	                                [["Tab", "Tab"], ["q", "Q", "\u00e4", "\u00c4"], ["w", "W", "\u00e5", "\u00c5"], ["e", "E", "\u00e9", "\u00c9"], ["r", "R", "\u00ae"], ["t", "T", "\u00fe", "\u00de"], ["y", "Y", "\u00fc", "\u00dc"], ["u", "U", "\u00fa", "\u00da"], ["i", "I", "\u00ed", "\u00cd"], ["o", "O", "\u00f3", "\u00d3"], ["p", "P", "\u00f6", "\u00d6"], ["[", "{", "\u00ab"], ["]", "}", "\u00bb"], ["\\", "|", "\u00ac", "\u00a6"]],
	                                [["Caps", "Caps"], ["a", "A", "\u00e1", "\u00c1"], ["s", "S", "\u00df", "\u00a7"], ["d", "D", "\u00f0", "\u00d0"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L", "\u00f8", "\u00d8"], [";", ":", "\u00b6", "\u00b0"], ["'", '"', "\u00b4", "\u00a8"], ["Enter", "Enter"]],
	                                [["Shift", "Shift"], ["z", "Z", "\u00e6", "\u00c6"], ["x", "X"], ["c", "C", "\u00a9", "\u00a2"], ["v", "V"], ["b", "B"], ["n", "N", "\u00f1", "\u00d1"], ["m", "M", "\u00b5"], [",", "<", "\u00e7", "\u00c7"], [".", ">"], ["/", "?", "\u00bf"], ["Shift", "Shift"]],
	                                [[" ", " ", " ", " "], ["Alt", "Alt"]]
	                                 ];


	/* ***** Define Dead Keys **************************************** */
	this.VKI_deadkey = new Object();

	// - Lay out each dead key set in one row of sub-arrays.  The rows
	//   below are wrapped so uppercase letters are below their lowercase
	//   equivalents.
	//
	// - The first letter in each sub-array is the letter pressed after
	//   the diacritic.  The second letter is the letter this key-combo
	//   will generate.
	//
	// - Note that if you have created a new keyboard layout and want it
	//   included in the distributed script, PLEASE TELL ME if you have
	//   added additional dead keys to the ones below.

	this.VKI_deadkey['"'] = this.VKI_deadkey['\u00a8'] = [ // Umlaut / Diaeresis / Greek Dialytika
	                                                       ["a", "\u00e4"], ["e", "\u00eb"], ["i", "\u00ef"], ["o", "\u00f6"], ["u", "\u00fc"], ["y", "\u00ff"], ["\u03b9", "\u03ca"], ["\u03c5", "\u03cb"],
	                                                       ["A", "\u00c4"], ["E", "\u00cb"], ["I", "\u00cf"], ["O", "\u00d6"], ["U", "\u00dc"], ["Y", "\u0178"], ["\u0399", "\u03aa"], ["\u03a5", "\u03ab"]
	                                                                                                                                                                                    ];
	this.VKI_deadkey['~'] = [ // Tilde
	                          ["a", "\u00e3"], ["o", "\u00f5"], ["n", "\u00f1"],
	                          ["A", "\u00c3"], ["O", "\u00d5"], ["N", "\u00d1"]
	                                                             ];
	this.VKI_deadkey['^'] = [ // Circumflex
	                          ["a", "\u00e2"], ["e", "\u00ea"], ["i", "\u00ee"], ["o", "\u00f4"], ["u", "\u00fb"], ["w", "\u0175"], ["y", "\u0177"],
	                          ["A", "\u00c2"], ["E", "\u00ca"], ["I", "\u00ce"], ["O", "\u00d4"], ["U", "\u00db"], ["W", "\u0174"], ["Y", "\u0176"]
	                                                                                                                                 ];
	this.VKI_deadkey['\u02c7'] = [ // Baltic caron
	                               ["c", "\u010D"], ["s", "\u0161"], ["z", "\u017E"], ["r", "\u0159"], ["d", "\u010f"], ["t", "\u0165"], ["n", "\u0148"], ["l", "\u013e"], ["e", "\u011b"],
	                               ["C", "\u010C"], ["S", "\u0160"], ["Z", "\u017D"], ["R", "\u0158"], ["D", "\u010e"], ["T", "\u0164"], ["N", "\u0147"], ["L", "\u013d"], ["E", "\u011a"]
	                                                                                                                                                                        ];
	this.VKI_deadkey['\u02d8'] = [ // Romanian and Turkish breve
	                               ["a", "\u0103"], ["g", "\u011f"],
	                               ["A", "\u0102"], ["G", "\u011e"]
	                                                 ];
	this.VKI_deadkey['`'] = [ // Grave
	                          ["a", "\u00e0"], ["e", "\u00e8"], ["i", "\u00ec"], ["o", "\u00f2"], ["u", "\u00f9"],
	                          ["A", "\u00c0"], ["E", "\u00c8"], ["I", "\u00cc"], ["O", "\u00d2"], ["U", "\u00d9"]
	                                                                                               ];
	this.VKI_deadkey["'"] = this.VKI_deadkey['\u00b4'] = this.VKI_deadkey['\u0384'] = [ // Acute / Greek Tonos
	                                                                                    ["a", "\u00e1"], ["e", "\u00e9"], ["i", "\u00ed"], ["o", "\u00f3"], ["u", "\u00fa"], ["\u03b1", "\u03ac"], ["\u03b5", "\u03ad"], ["\u03b7", "\u03ae"], ["\u03b9", "\u03af"], ["\u03bf", "\u03cc"], ["\u03c5", "\u03cd"], ["\u03c9", "\u03ce"],
	                                                                                    ["A", "\u00c1"], ["E", "\u00c9"], ["I", "\u00cd"], ["O", "\u00d3"], ["U", "\u00da"], ["\u0391", "\u0386"], ["\u0395", "\u0388"], ["\u0397", "\u0389"], ["\u0399", "\u038a"], ["\u039f", "\u038c"], ["\u03a5", "\u038e"], ["\u03a9", "\u038f"]
	                                                                                                                                                                                                                                                                                                              ];
	this.VKI_deadkey['\u02dd'] = [ // Hungarian Double Acute Accent
	                               ["o", "\u0151"], ["u", "\u0171"],
	                               ["O", "\u0150"], ["U", "\u0170"]
	                                                 ];
	this.VKI_deadkey["\u0385"] = [ // Greek Dialytika + Tonos
	                               ["\u03b9", "\u0390"], ["\u03c5", "\u03b0"]
	                                                      ];
	this.VKI_deadkey['\u00b0'] = this.VKI_deadkey['\u00ba'] = [ // Ring
	                                                            ["a", "\u00e5"],
	                                                            ["A", "\u00c5"]
	                                                             ];



	/* ***** Find tagged input & textarea elements ******************* */
	var inputElems = [
	                  document.getElementsByTagName('input'),
	                  document.getElementsByTagName('textarea'),
	                  ];
	                  for (var x = 0, inputCount = 0, elem; elem = inputElems[x++];) {
	                	  if (elem) {
	                		  for (var y = 0, keyid = "", ex; ex = elem[y++];) {
	                			  if ((ex.nodeName == "TEXTAREA" || ex.type == "text" || ex.type == "password") && ex.className.indexOf("keyboardInput") > -1) {
	                				  if (!ex.id) {
	                					  do { keyid = 'keyboardInputInitiator' + inputCount++; } while (document.getElementById(keyid));
	                					  ex.id = keyid;
	                				  } else keyid = ex.id;
	                				  var keybut = document.createElement('img');

	                				  keybut.src = "data/interface/v1_0/img/keyboard.gif";

	                				  if (window.location.href.indexOf('login.php') > 0) {
	                					  keybut.src = "../../data/interface/v1_0/img/keyboard.gif";
	                				  }

	                				  keybut.alt = "Keyboard interface";
	                				  keybut.className = "keyboardInputInitiator";
	                				  keybut.title = "Bật bàn phím ảo";
	                				  keybut.onclick = (function(a) { return function() { self.VKI_show(a); }; })(keyid);
	                				  //ex.onclick = (function(a) { return function() { self.VKI_show(a); }; })(keyid);
	                				  //ex.onfocus = (function(a) { return function() { self.VKI_show2(a); }; })(keyid);
	                				  //ex.onblur = function(){self.VKI_close();};
	                				  //ex.onblur = function() { self.VKI_close();
	                				  //try { this.VKI_keyboard.parentNode.removeChild(this.VKI_keyboard); } catch (e) {}
	                				  //this.VKI_visible = "";
	                				  //this.VKI_target.focus();
	                				  //this.VKI_target = "";
	                				  //ex.click();
                                      /* khong check SecCode nua
	                				  document.frm_login.SecCode.onfocus = function() {
	                					  self.VKI_close();
	                					  if(document.frm_login.SecCode.value.length < 1){
	                						  document.getElementById("hintPwd").style.display = "inline";
	                						  setTimeout('document.getElementById("hintPwd").style.display = "none";',3000);
	                					  }
	                				  }
	                				  document.frm_login.SecCode.onblur = function() {
	                					  //self.VKI_close();
	                					  document.getElementById("hintPwd").style.display = "none";
	                				  }
                                      */

	                			  //};
	                				  ex.parentNode.insertBefore(keybut, ex.nextSibling);
	                				  //ex.onclick = (function(a) { return function() { self.VKI_show(a); }; })(keyid);
	                				  //ex.onfocus = (function(a) { return function() { self.VKI_show(a); }; })(keyid);
	                				  if (!window.sidebar && !window.opera) {
	                					  ex.onclick = ex.onkeyup = ex.onselect = function() {
	                						  if (self.VKI_target.createTextRange) self.VKI_range = document.selection.createRange();
	                					  };
	                				  }
	                			  }
	                		  }
	                	  }
	                  }


	/* ***** Build the keyboard interface **************************** */
	this.VKI_keyboard = document.createElement('table');
	this.VKI_keyboard.id = "keyboardInputMaster";
	this.VKI_keyboard.cellSpacing = this.VKI_keyboard.cellPadding = this.VKI_keyboard.border = "0";

	var layouts = 0;
	for (ktype in this.VKI_layout) if (typeof this.VKI_layout[ktype] == "object") layouts++;

	var thead = document.createElement('thead');
	var tr = document.createElement('tr');
	var th = document.createElement('th');
	if (layouts > 1) {
		var kblist = document.createElement('select');
		for (ktype in this.VKI_layout) {
			if (typeof this.VKI_layout[ktype] == "object") {
				var opt = document.createElement('option');
				opt.value = ktype;
				opt.appendChild(document.createTextNode(ktype));
				kblist.appendChild(opt);
			}
		}
		kblist.value = this.VKI_kt;
		kblist.onchange = function() {
			self.VKI_kt = this.value;
			self.VKI_buildKeys();
			self.VKI_position();
		};
		th.appendChild(kblist);
	}

	/*var label = document.createElement('label');
            var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.checked = this.VKI_deadkeysOn;
                checkbox.title = "Toggle dead key input";
                checkbox.onclick = function() {
                  self.VKI_deadkeysOn = this.checked;
                  this.nextSibling.nodeValue = " Dead keys: " + ((this.checked) ? "On" : "Off");
                  self.VKI_modify("");
                  return true;
                };
              label.appendChild(checkbox);
              label.appendChild(document.createTextNode(" Dead keys: " + ((checkbox.checked) ? "On" : "Off")))
          th.appendChild(label);
        tr.appendChild(th);*/

	var td = document.createElement('td');

	//var password_hint = document.createElement('label');
	//password_hint.id = "keyboardInputClear";
	//password_hint.appendChild(document.createTextNode("Nhập mật khẩu hoặc OTP"));
	//password_hint.style.border = '1px solid #000';
	//password_hint.style.float = 'left';
	//password_hint.style.position = 'absolute';
	//password_hint.style.marginLeft = '-250px';
	//td.appendChild(document.createTextNode("Nhập mật khẩu hoặc OTP"));
	//td.appendChild(document.createTextNode("Nhập mật khẩu hoặc OTP"));
	//td.appendChild(document.createTextNode("Nhập mật khẩu hoặc OTP"));
	//td.appendChild(document.createTextNode("Nhập mật khẩu hoặc OTP"));
	//td.appendChild(password_hint);
	//td.appendChild(password_hint);
	//td.appendChild(password_hint);
	//td.appendChild(password_hint);

	var clearer = document.createElement('span');
	clearer.id = "keyboardInputClear";
	clearer.appendChild(document.createTextNode("Xóa"));
	clearer.title = "Xóa mật khẩu";
	clearer.onmousedown = function() { this.className = "pressed"; };
	clearer.onmouseup = function() { this.className = ""; };
	clearer.onclick = function() {
		self.VKI_target.value = "";
		self.VKI_target.focus();
		return false;
	};
	td.appendChild(clearer);

	var closer = document.createElement('span');
	closer.id = "keyboardInputClose";
	closer.appendChild(document.createTextNode('X'));
	closer.title = "Đóng bàn phím";
	closer.onmousedown = function() { this.className = "pressed"; };
	closer.onmouseup = function() { this.className = ""; };
	closer.onclick = function() { self.VKI_close(); };
	td.appendChild(closer);

	tr.appendChild(td);
	thead.appendChild(tr);
	this.VKI_keyboard.appendChild(thead);

	var tbody = document.createElement('tbody');
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	td.colSpan = "2";
	var div = document.createElement('div');
	div.id = "keyboardInputLayout";
	td.appendChild(div);
	/*var div = document.createElement('div');
          var ver = document.createElement('var');
              ver.appendChild(document.createTextNode("v" + this.VKI_version));
            div.appendChild(ver);
          td.appendChild(div);*/
	tr.appendChild(td);
	tbody.appendChild(tr);
	this.VKI_keyboard.appendChild(tbody);



	/* ***** Functions ************************************************ */
	/* ******************************************************************
	 * Build or rebuild the keyboard keys
	 *
	 */
	this.VKI_buildKeys = function() {
		this.VKI_shift = this.VKI_capslock = this.VKI_alternate = this.VKI_dead = false;
		//this.VKI_deadkeysOn = (this.VKI_layoutDDK[this.VKI_kt]) ? false : this.VKI_keyboard.getElementsByTagName('label')[0].getElementsByTagName('input')[0].checked;

		var container = this.VKI_keyboard.tBodies[0].getElementsByTagName('div')[0];
		while (container.firstChild) container.removeChild(container.firstChild);

		for (var x = 0, hasDeadKey = false, lyt; lyt = this.VKI_layout[this.VKI_kt][x++];) {
			var table = document.createElement('table');
			table.cellSpacing = table.cellPadding = table.border = "0";
			if (lyt.length <= this.VKI_keyCenter) table.className = "keyboardInputCenter";
			var tbody = document.createElement('tbody');
			var tr = document.createElement('tr');
			for (var y = 0, lkey; lkey = lyt[y++];) {
				if (!this.VKI_layoutDDK[this.VKI_kt] && !hasDeadKey)
					for (var z = 0; z < lkey.length; z++)
						if (this.VKI_deadkey[lkey[z]]) hasDeadKey = true;

				var td = document.createElement('td');
				td.appendChild(document.createTextNode(lkey[0]));

				var alive = false;
				if (this.VKI_deadkeysOn) for (key in this.VKI_deadkey) if (key === lkey[0]) alive = true;
				td.className = (alive) ? "alive" : "";
				if (lyt.length > this.VKI_keyCenter && y == lyt.length)
					td.className += " last";

				if (lkey[0] == " ")
					td.style.paddingLeft = td.style.paddingRight = "50px";
				td.onmouseover = function() { if (this.className != "dead" && this.firstChild.nodeValue != "\xa0") this.className += " hover"; };
				td.onmouseout = function() { if (this.className != "dead") this.className = this.className.replace(/ ?(hover|pressed)/g, ""); };
				td.onmousedown = function() { if (this.className != "dead" && this.firstChild.nodeValue != "\xa0") this.className += " pressed"; };
				td.onmouseup = function() { if (this.className != "dead") this.className = this.className.replace(/ ?pressed/g, ""); };
				td.ondblclick = function() { return false; };

				switch (lkey[1]) {
				case "Caps":
				case "Shift":
				case "Alt":
				case "AltGr":
					td.onclick = (function(type) { return function() { self.VKI_modify(type); return false; }})(lkey[1]);
					break;
				case "Tab":
					td.onclick = function() { self.VKI_insert("\t"); return false; };
					break;
				case "Bksp":
					td.onclick = function() {
						self.VKI_target.focus();
						if (self.VKI_target.setSelectionRange) {
							var srt = self.VKI_target.selectionStart;
							var len = self.VKI_target.selectionEnd;
							if (srt < len) srt++;
							self.VKI_target.value = self.VKI_target.value.substr(0, srt - 1) + self.VKI_target.value.substr(len);
							self.VKI_target.setSelectionRange(srt - 1, srt - 1);
						} else if (self.VKI_target.createTextRange) {
							try { self.VKI_range.select(); } catch(e) {}
							self.VKI_range = document.selection.createRange();
							if (!self.VKI_range.text.length) self.VKI_range.moveStart('character', -1);
							self.VKI_range.text = "";
						} else self.VKI_target.value = self.VKI_target.value.substr(0, self.VKI_target.value.length - 1);
						if (self.VKI_shift) self.VKI_modify("Shift");
						if (self.VKI_alternate) self.VKI_modify("AltGr");
						return true;
					};
					break;
				case "Enter":
					td.onclick = function() {
						if (self.VKI_target.nodeName == "TEXTAREA") { self.VKI_insert("\n"); } else self.VKI_close();
						return true;
					};
					break;
				default:
					td.onclick = function() {
					if (self.VKI_deadkeysOn && self.VKI_dead) {
						if (self.VKI_dead != this.firstChild.nodeValue) {
							for (key in self.VKI_deadkey) {
								if (key == self.VKI_dead) {
									if (this.firstChild.nodeValue != " ") {
										for (var z = 0, rezzed = false, dk; dk = self.VKI_deadkey[key][z++];) {
											if (dk[0] == this.firstChild.nodeValue) {
												self.VKI_insert(dk[1]);
												rezzed = true;
												break;
											}
										}
									} else {
										self.VKI_insert(self.VKI_dead);
										rezzed = true;
									}
									break;
								}
							}
						} else rezzed = true;
					}
					self.VKI_dead = false;

					if (!rezzed && this.firstChild.nodeValue != "\xa0") {
						if (self.VKI_deadkeysOn) {
							for (key in self.VKI_deadkey) {
								if (key == this.firstChild.nodeValue) {
									self.VKI_dead = key;
									this.className = "dead";
									if (self.VKI_shift) self.VKI_modify("Shift");
									if (self.VKI_alternate) self.VKI_modify("AltGr");
									break;
								}
							}
							if (!self.VKI_dead) self.VKI_insert(this.firstChild.nodeValue);
						} else self.VKI_insert(this.firstChild.nodeValue);
					}

					self.VKI_modify("");
					return false;
				};

				}
				tr.appendChild(td);
				tbody.appendChild(tr);
				table.appendChild(tbody);

				for (var z = lkey.length; z < 4; z++) lkey[z] = "\xa0";
			}
			container.appendChild(table);
		}
		//this.VKI_keyboard.getElementsByTagName('label')[0].style.display = (hasDeadKey) ? "inline" : "none";
	};

	this.VKI_buildKeys();
	VKI_disableSelection(this.VKI_keyboard);


	/* ******************************************************************
	 * Controls modifier keys
	 *
	 */
	this.VKI_modify = function(type) {
		switch (type) {
		case "Alt":
		case "AltGr": this.VKI_alternate = !this.VKI_alternate; break;
		case "Caps": this.VKI_capslock = !this.VKI_capslock; break;
		case "Shift": this.VKI_shift = !this.VKI_shift; break;
		}
		var vchar = 0;
		if (!this.VKI_shift != !this.VKI_capslock) vchar += 1;

		var tables = this.VKI_keyboard.getElementsByTagName('table');
		for (var x = 0; x < tables.length; x++) {
			var tds = tables[x].getElementsByTagName('td');
			for (var y = 0; y < tds.length; y++) {
				var dead = alive = target = false;
				var lkey = this.VKI_layout[this.VKI_kt][x][y];

				switch (lkey[1]) {
				case "Alt":
				case "AltGr":
					if (this.VKI_alternate) dead = true;
					break;
				case "Shift":
					if (this.VKI_shift) dead = true;
					break;
				case "Caps":
					if (this.VKI_capslock) dead = true;
					break;
				case "Tab": case "Enter": case "Bksp": break;
				default:
					if (type) tds[y].firstChild.nodeValue = lkey[vchar + ((this.VKI_alternate && lkey.length == 4) ? 2 : 0)];
				if (this.VKI_deadkeysOn) {
					var char = tds[y].firstChild.nodeValue;
					if (this.VKI_dead) {
						if (char == this.VKI_dead) dead = true;
						for (var z = 0; z < this.VKI_deadkey[this.VKI_dead].length; z++)
							if (char == this.VKI_deadkey[this.VKI_dead][z][0]) { target = true; break; }
					}
					for (key in this.VKI_deadkey) if (key === char) { alive = true; break; }
				}
				}

				tds[y].className = (dead) ? "dead" : ((target) ? "target" : ((alive) ? "alive" : ""));
				if (y == tds.length - 1 && tds.length > this.VKI_keyCenter) tds[y].className += " last";
			}
		}
		this.VKI_target.focus();
	};


	/* ******************************************************************
	 * Insert text at the cursor
	 *
	 */
	this.VKI_insert = function(text) {
		this.VKI_target.focus();
		if (this.VKI_target.setSelectionRange) {
			var srt = this.VKI_target.selectionStart;
			var len = this.VKI_target.selectionEnd;
			this.VKI_target.value = this.VKI_target.value.substr(0, srt) + text + this.VKI_target.value.substr(len);
			if (text == "\n" && window.opera) srt++;
			this.VKI_target.setSelectionRange(srt + text.length, srt + text.length);
		} else if (this.VKI_target.createTextRange) {
			try { this.VKI_range.select(); } catch(e) {}
			this.VKI_range = document.selection.createRange();
			this.VKI_range.text = text;
			this.VKI_range.collapse(true);
			this.VKI_range.select();
		} else this.VKI_target.value += text;
		if (this.VKI_shift) this.VKI_modify("Shift");
		if (this.VKI_alternate) this.VKI_modify("AltGr");
		this.VKI_target.focus();
	};


	/* ******************************************************************
	 * Show the keyboard interface
	 *
	 */
	this.VKI_show = function(id) {
		if (this.VKI_target = document.getElementById(id)) {
			if (this.VKI_visible != id) {
				this.VKI_range = "";
				try { this.VKI_keyboard.parentNode.removeChild(this.VKI_keyboard); } catch (e) {}

				var elem = this.VKI_target;
				this.VKI_target.keyboardPosition = "absolute";
				do {
					if (VKI_getStyle(elem, "position") == "fixed") {
						this.VKI_target.keyboardPosition = "fixed";
						break;
					}
				} while (elem = elem.offsetParent);

				this.VKI_keyboard.style.top = this.VKI_keyboard.style.right = this.VKI_keyboard.style.bottom = this.VKI_keyboard.style.left = "auto";
				this.VKI_keyboard.style.position = this.VKI_target.keyboardPosition;
				document.body.appendChild(this.VKI_keyboard);

				this.VKI_visible = this.VKI_target.id;
				this.VKI_position();
				this.VKI_target.focus();
			} else this.VKI_close();
		}
	};

	this.VKI_show2 = function(id) {
		if (this.VKI_target = document.getElementById(id)) {
			if (this.VKI_visible != id) {
				this.VKI_range = "";
				try { this.VKI_keyboard.parentNode.removeChild(this.VKI_keyboard); } catch (e) {}

				var elem = this.VKI_target;
				this.VKI_target.keyboardPosition = "absolute";
				do {
					if (VKI_getStyle(elem, "position") == "fixed") {
						this.VKI_target.keyboardPosition = "fixed";
						break;
					}
				} while (elem = elem.offsetParent);

				this.VKI_keyboard.style.top = this.VKI_keyboard.style.right = this.VKI_keyboard.style.bottom = this.VKI_keyboard.style.left = "auto";
				this.VKI_keyboard.style.position = this.VKI_target.keyboardPosition;
				document.body.appendChild(this.VKI_keyboard);

				this.VKI_visible = this.VKI_target.id;
				this.VKI_position();
				this.VKI_target.focus();
			} //else this.VKI_close();
		}
	};

	/* ******************************************************************
	 * Position the keyboard
	 *
	 */
	this.VKI_position = function() {
		if (self.VKI_visible != "") {
			var inputElemPos = VKI_findPos(self.VKI_target);
			self.VKI_keyboard.style.top = inputElemPos[1] - ((self.VKI_target.keyboardPosition == "fixed") ? document.body.scrollTop : 0) + self.VKI_target.offsetHeight + 3 + "px";
			self.VKI_keyboard.style.left = (Math.min(VKI_innerDimensions()[0] - self.VKI_keyboard.offsetWidth - 15, inputElemPos[0]) + 140) + "px";
		}
	};


	if (window.addEventListener) {
		window.addEventListener('resize', this.VKI_position, false);
	} else if (window.attachEvent)
		window.attachEvent('onresize', this.VKI_position);


	/* ******************************************************************
	 * Close the keyboard interface
	 *
	 */
	this.VKI_close = function() {
		try { this.VKI_keyboard.parentNode.removeChild(this.VKI_keyboard); } catch (e) {}
		this.VKI_visible = "";
		//this.VKI_target.focus();
		this.VKI_target = "";
	};
}


/* ***** Attach this script to the onload event ******************** */
if (window.addEventListener) {
	window.addEventListener('load', VKI_buildKeyboardInputs, false);
} else if (window.attachEvent)
	window.attachEvent('onload', VKI_buildKeyboardInputs);

/**
 * description...
 * Date :
 *
 * @param obj
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function VKI_findPos(obj) {
	var curleft = curtop = 0;
	do {
		curleft += obj.offsetLeft;
		curtop += obj.offsetTop;
	} while (obj = obj.offsetParent);
	return [curleft, curtop];
}

/**
* description...
* Date :
*
* @return unknown_type
*
* @author ...<...@vietunion.com.vn>
* @since function available since version 1.0
*/
function VKI_innerDimensions() {
	if (self.innerHeight) {
		return [self.innerWidth, self.innerHeight];
	} else if (document.documentElement && document.documentElement.clientHeight) {
		return [document.documentElement.clientWidth, document.documentElement.clientHeight];
	} else if (document.body)
		return [document.body.clientWidth, document.body.clientHeight];
	return [0, 0];
}

/**
* description...
* Date :
*
* @param obj
* @param styleProp
* @return unknown_type
*
* @author ...<...@vietunion.com.vn>
* @since function available since version 1.0
*/
function VKI_getStyle(obj, styleProp) {
	if (obj.currentStyle) {
		var y = obj.currentStyle[styleProp];
	} else if (window.getComputedStyle)
		var y = window.getComputedStyle(obj, null)[styleProp];
	return y;
}

/**
* description...
* Date :
*
* @param elem
* @return unknown_type
*
* @author ...<...@vietunion.com.vn>
* @since function available since version 1.0
*/
function VKI_disableSelection(elem) {
	elem.onselectstart = function() { return false; };
	elem.unselectable = "on";
	elem.style.MozUserSelect = "none";
	elem.style.cursor = "default";
	if (window.opera) elem.onmousedown = function() { return false; };
}
/*---end keyboard---*/
//------------------------ file isDate -------------

var dtCh= "/";
var tmp = new Date();
var minYear = 1900;
//Tri.Le
//var maxYear = 2100
var maxYear = tmp.getFullYear() - 14;
/**
 * description...
 * Date :
 *
 * @param s
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function isInteger(s)
{
	var i;
	for (i = 0; i < s.length; i++){
		// Check that current character is number.
		var c = s.charAt(i);
		if (((c < "0") || (c > "9"))) return false;
	}
	// All characters are numbers.
	return true;
}

/**
* description...
* Date :
*
* @param s
* @param bag
* @return unknown_type
*
* @author ...<...@vietunion.com.vn>
* @since function available since version 1.0
*/
function stripCharsInBag(s, bag)
{
	var i;
	// Search through string's characters one by one.
	// If character is not in bag, append to returnString.
	for (i = 0; i < s.length; i++){
		var c = s.charAt(i);
		if (bag.indexOf(c) == -1) return false;
	}
	return true;
}

/**
* description...
* Date :
*
* @param year
* @return unknown_type
*
* @author ...<...@vietunion.com.vn>
* @since function available since version 1.0
*/
function daysInFebruary (year)
{
	// February has 29 days in any year evenly divisible by four,
	// EXCEPT for centurial years which are not also divisible by 400.
	return (((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0))) ? 29 : 28 );
}

/**
* description...
* Date :
*
* @param n
* @return unknown_type
*
* @author ...<...@vietunion.com.vn>
* @since function available since version 1.0
*/
function DaysArray(n)
{
	for (var i = 1; i <= n; i++) {
		this[i] = 31
		if (i==4 || i==6 || i==9 || i==11) {this[i] = 30}
		if (i==2) {this[i] = 29}
	}
	return this
}
/**
*  description...
* Date :
*
* @param dtStr
* @return unknown_type
*
* @author ...<...@vietunion.com.vn>
* @since function available since version 1.0
*/
function isDate(dtStr)
{
	var daysInMonth = DaysArray(12)
	var pos1=dtStr.indexOf(dtCh)
	var pos2=dtStr.indexOf(dtCh,pos1+1)
	var strMonth=dtStr.substring(0,pos1)
	var strDay=dtStr.substring(pos1+1,pos2)
	var strYear=dtStr.substring(pos2+1)
	strYr=strYear
	if (strDay.charAt(0)=="0" && strDay.length>1) strDay=strDay.substring(1)
	if (strMonth.charAt(0)=="0" && strMonth.length>1) strMonth=strMonth.substring(1)
	for (var i = 1; i <= 3; i++) {
		if (strYr.charAt(0)=="0" && strYr.length>1) strYr=strYr.substring(1)
	}
	month=parseInt(strMonth)
	day=parseInt(strDay)
	year=parseInt(strYr)
	if (pos1==-1 || pos2==-1){
		//alert("The date format should be : mm/dd/yyyy")
		return false
	}
	if (strMonth.length<1 || month<1 || month>12){
		return false;
	}
	if (strDay.length<1 || day<1 || day>31 || (month==2 && day>daysInFebruary(year)) || day > daysInMonth[month]){

		return false
	}
	if (strYear.length != 4 || year==0 || year<minYear || year>maxYear){
		//alert("Please enter a valid 4 digit year between "+minYear+" and "+maxYear)
		return false
	}
	if (dtStr.indexOf(dtCh,pos2+1)!=-1 || isInteger(stripCharsInBag(dtStr, dtCh))==false){
		return false
	}
	return true
}
///------------------------
/**
 * description...
 * Date :
 *
 * @param value
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 */
function isnumber(value){
	if(value.toLowerCase()!= value.toUpperCase() ){
		return false;
	}
	return true;
}

/**
* description...
* Date :
*
* @param frm
* @return unknown_type
*
* @author ...<...@vietunion.com.vn>
* @since function available since version 1.0
*/
function checkDate(frm)
{
	var day,month,year,birthday;
	day = frm.BirthDay.options[frm.BirthDay.selectedIndex].value;
	month = frm.BirthMonth.options[frm.BirthMonth.selectedIndex].value;
	year = frm.BirthYear.options[frm.BirthYear.selectedIndex].value;
	day = day.toString();
	if(day.length<2)
	{
		day = "0"+day;
	}
	if(month.length<2)
	{
		month = "0"+month;
	}
	birthday = month+"/"+day+"/"+year;
	if(!isDate(birthday))
	{
		return false;
	}
	return true;
}

/**
* Get mouse position
* Call: onclick="getMouseXY(event);"
* Return: pos[0] = mouseX, pos[1] = mouseY
*/

/**
 * description...
 * Date :
 *
 * @param e
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function getMouseXY(e)
{
	var IE = document.all?true:false
			var pos = Array(2);

	if (IE)
	{ // grab the x-y pos.s if browser is IE
		tempX = event.clientX + document.body.scrollLeft;
	tempY = event.clientY + document.body.scrollTop;
	}
	else
	{  // grab the x-y pos.s if browser is NS
		tempX = e.pageX;
	tempY = e.pageY;
	}
	// catch possible negative values in NS4
	if (tempX < 0){tempX = 0;}
	if (tempY < 0){tempY = 0;}
	pos['x'] = tempX;
	pos['y'] = tempY;
	// show the position values in the form named Show
	// in the text fields named MouseX and MouseY
	return pos;
}
/**
* end get mouse position
*/

/*-----Phat hien form co thay doi ko--------*/
/**
 * description...
 * Date :
 *
 * @param oForm
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function form_is_modified(oForm)
{
	var el, opt, hasDefault, i = 0, j;
	while (el = oForm.elements[i++]) {
		switch (el.type) {
		case 'text' :
		case 'textarea' :
		case 'hidden' :
			if (el.name != 'txtOTPConfirm' && !/^\s*$/.test(el.value) && el.value != el.defaultValue) return true;
			break;
		case 'checkbox' :
		case 'radio' :
			if (el.checked != el.defaultChecked) return true;
			break;
		case 'select-one' :
		case 'select-multiple' :
			j = 0, hasDefault = false;
			while (opt = el.options[j++])
				if (opt.defaultSelected) hasDefault = true;
			j = hasDefault ? 0 : 1;
			while (opt = el.options[j++])
				if (opt.selected != opt.defaultSelected) return true;
			break;
		}
	}
	return false;
}

//Ko chep nhan viec embed frame cua cac trang web khac


//lightbox (nam.nguyen)

/**
 * description...
 * Date :
 *
 * @param msg
 * @return unknown_type
 *
 * @author Nam.Nguyen<nam.nguyen@vietunion.com.vn>
 * @since function available since version 1.0
 */
function showLight(msg){

	var ie = document.all && !window.opera;
	//var dom = document.getElementById;
	var iebody = (document.compatMode == 'CSS1Compat') ? document.documentElement : document.body;
	//var objref = (dom) ? document.getElementById('Guest') : document.all.Guest;
	var scroll_top = (ie) ? iebody.scrollTop : window.pageYOffset;
	//var scroll_left = (ie) ? iebody.scrollLeft : window.pageXOffset;
	//var docwidth = (ie) ? iebody.clientWidth : window.innerWidth;
	var docheight = (ie) ? iebody.clientHeight: window.innerHeight;

	var f = document.getElementById('fade');
	var l = document.getElementById('light');
	f.style.height = docheight + scroll_top + 'px';
	document.getElementById('lConent').innerHTML = msg;
	if (!ie)
	{
		f.style.top = 0;
		l.style.left = ((document.documentElement.clientWidth + document.documentElement.scrollLeft) / 2) - (300 / 2) + 'px';
		//var y = (document.documentElement.clientHeight / 2) - (l.offsetHeight / 2);
		var y = window.pageYOffset - 100;
		l.style.top = y + 'px';
	}
	f.style.display='block';
	l.style.display='block';

}
/**
* description...
* Date :
*
* @return unknown_type
*
* @author Nam.Nguyen<Nam.Nguyen@vietunion.com.vn>
* @since function available since version 1.0
*/
function closeLight(){
	document.getElementById('light').style.display='none';
	document.getElementById('fade').style.display='none';
}

/* window.alert = function(txt) {
showLight(txt);
}
 */

/**
 * Tri.Le
 * Check check box when user click on the label
 */
/**
 * description...
 * Date :
 *
 * @param cbCheckbox
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function onclickCheck(cbCheckbox)
{
	if (cbCheckbox.checked)
	{
		cbCheckbox.checked = false;
	}
	else
	{
		cbCheckbox.checked = true;
	}
}


/**
 * Format Number
 * Date :
 *
 * @param string str
 * @return
 *
 * @author Nam.Nguyen <nam.nguyen@vietunion.com.vn>
 * @since function available since version 1.0
 */
function formatNo(str)
{
	x1 = str;

	//if(!isNaN(x1)){
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
//}

	return x1;

}

var http_request = false;
/**
 * description...
 * Date :
 *
 * @param url
 * @param func
 * @return unknown_type
 *
 * @author Nam.Nguyen<nam.nguyen@vietunion.com.vn>
 * @since function available since version 1.0
 */
function makeAjax(url, func)
{
	var job = new xajax();

	job.method="GET";

	var i = url.indexOf('r=');
	var j = url.indexOf('&',i);

	if (j > i)
	{
		job.setVar("r", url.substring(i+2,j));
		//alert((i)+'==='+(j)+'\nurl='+url);
		//alert("r="+url.substring(i+2,j));
	}
	else
	{
		job.setVar("r", url.substring(i+2));
	}

	i = url.indexOf('sc=');
	j = url.indexOf('&',i);

	if (j > i)
	{
		job.setVar("sc", url.substring(i+3,j));
		//alert("sc="+url.substring(i+3,j-i-3));
	}
	else
	{
		job.setVar("sc", url.substring(i+3));
		//alert("sc="+url.substring(i+3));
	}
	i = url.indexOf('?');

	if (i > -1)
		url = url.substring(0,i);

	//alert('ur='+url);

	job.requestFile = url;
	job.onCompletion = function()
	{
		//job.response luc nay se la bien chua ket qua tra ve
		result = job.response;
		eval(func);
	};
	job.runAJAX();
}
/**
 * description...
 * Date :
 *
 * @param str
 * @param n
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */

function Left(str, n){
	if (n <= 0)
		return "";
	else if (n > String(str).length)
		return str;
	else
		return String(str).substring(0,n);
}


/**
* Tool tips
*/
/**
 * description...
 * Date :
 *
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function MM_swapImgRestore() { //v3.0
	var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_preloadImages() { //v3.0
	var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
	var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
		if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}
/**
* description...
* Date :
*
* @param n
* @param d
* @return unknown_type
*
* @author ...<...@vietunion.com.vn>
* @since function available since version 1.0
*/
function MM_findObj(n, d) { //v4.0
	var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
		d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
	if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
	for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
	if(!x && document.getElementById) x=document.getElementById(n); return x;
}

/**
* description...
* Date :
*
* @return unknown_type
*
* @author ...<...@vietunion.com.vn>
* @since function available since version 1.0
*/
function MM_swapImage() { //v3.0
	var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
		if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}
//-------------------------------------------------------------
//Select all the checkboxes (Hotmail style)
//-------------------------------------------------------------
/**
 * description...
 * Date :
 *
 * @param theBox
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function SelectAllCheckboxes(theBox){

	xState=theBox.checked;
	elm=theBox.form.elements;
	for(i=0;i<elm.length;i++)
		if(elm[i].type=="checkbox" && elm[i].id!=theBox.id)
		{
			//elm[i].click();
			if(elm[i].checked!=xState)
				elm[i].click();
			//elm[i].checked=xState;
		}
}
//Open Image
var fBrw=(navigator.userAgent.indexOf('MSIE')!= -1 && navigator.userAgent.indexOf('Windows')!= -1);


/**
 * description...
 * Date :
 *
 * @param file
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function openNewImage(file)
{
	picfile = new Image();
	picfile.src =(file);
	width=picfile.width;
	height=picfile.height;

	//location.replace('http://localhost:8090/news/images/news/duongsat.jpg');
	//window.open('/news/viewpicture.aspx?filename=duongsat.jpg');
	//window.open(file,'showpicture', 'toolbar=no,location=no ,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no,topmargin=0,leftmargin=0,width='+width+',height='+height);

	winDef = 'status=no,resizable=no,scrollbars=no,toolbar=no,location=no,fullscreen=no,titlebar=yes,height='.concat(height).concat(',').concat('width=').concat(width).concat(',');
	winDef = winDef.concat('top=').concat((screen.height - height)/2).concat(',');
	winDef = winDef.concat('left=').concat((screen.width - width)/2);
	newwin = open('', '_blank', winDef);

	newwin.document.writeln('<body topmargin="0" leftmargin="0" marginheight="0" marginwidth="0">');
	newwin.document.writeln('<a href="" onClick="window.close(); return false;"><img src="', file, '" alt="', (fBrw) ? '&#272;&#243;ng l&#7841;i' : 'Dong lai', '" border=0></a>');
	newwin.document.writeln('</body>');

}
/**
* description...
* Date :
*
* @param file
* @param width
* @param height
* @return unknown_type
*
* @author ...<...@vietunion.com.vn>
* @since function available since version 1.0
*/
function openImage(file,width,height) {

	//location.replace('http://localhost:8090/news/images/news/duongsat.jpg');
	//window.open('/news/viewpicture.aspx?filename=duongsat.jpg');
	//window.open(file,'showpicture', 'toolbar=no,location=no ,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no,topmargin=0,leftmargin=0,width='+width+',height='+height);
	winDef = 'status=no,resizable=no,scrollbars=no,toolbar=no,location=no,fullscreen=no,titlebar=yes,height='.concat(height).concat(',').concat('width=').concat(width).concat(',');
	winDef = winDef.concat('top=').concat((screen.height - height)/2).concat(',');
	winDef = winDef.concat('left=').concat((screen.width - width)/2);
	newwin = open('', '_blank', winDef);

	newwin.document.writeln('<body topmargin="0" leftmargin="0" marginheight="0" marginwidth="0">');
	newwin.document.writeln('<a href="" onClick="window.close(); return false;"><img src="', file, '" alt="', (fBrw) ? '&#272;&#243;ng l&#7841;i' : 'Dong lai', '" border=0></a>');
	newwin.document.writeln('</body>');

}

/**
* description...
* Date :
*
* @param file
* @param width
* @param height
* @return unknown_type
*
* @author ...<...@vietunion.com.vn>
* @since function available since version 1.0
*/
function openfile(file,width,height) {

	//location.replace('http://localhost:8090/news/images/news/duongsat.jpg');
	//window.open('/news/viewpicture.aspx?filename=duongsat.jpg');
	//window.open(file,'showpicture', 'toolbar=no,location=no ,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no,topmargin=0,leftmargin=0,width='+width+',height='+height);
	winDef = 'status=no,resizable=no,scrollbars=no,toolbar=no,location=no,fullscreen=no,titlebar=yes,height='.concat(height).concat(',').concat('width=').concat(width).concat(',');
	winDef = winDef.concat('top=').concat((screen.height - height)/2).concat(',');
	winDef = winDef.concat('left=').concat((screen.width - width)/2);
	newwin = open(file, '_blank', winDef);

}

/*
* This is the function that actually highlights a text string by
* adding HTML tags before and after all occurrences of the search
* term. You can pass your own tags if you'd like, or if the
* highlightStartTag or highlightEndTag parameters are omitted or
* are empty strings then the default <font> tags will be used.
*/
/**
 * description...
 * Date :
 *
 * @param bodyText
 * @param searchTerm
 * @param highlightStartTag
 * @param highlightEndTag
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function doHighlight(bodyText, searchTerm, highlightStartTag, highlightEndTag) {
	// the highlightStartTag and highlightEndTag parameters are optional
	if ((!highlightStartTag) || (!highlightEndTag)) {
		highlightStartTag = "<font style='color:blue; background-color:yellow;'>";
		highlightEndTag = "</font>";
	}

	// find all occurences of the search term in the given text,
	// and add some "highlight" tags to them (we're not using a
	// regular expression search, because we want to filter out
	// matches that occur within HTML tags and script blocks, so
	// we have to do a little extra validation)
	var newText = "";
	var i = -1;
	var lcSearchTerm = searchTerm.toLowerCase();
	var lcBodyText = bodyText.toLowerCase();

	while (bodyText.length > 0) {
		i = lcBodyText.indexOf(lcSearchTerm, i+1);
		if (i < 0) {
			newText += bodyText;
			bodyText = "";
		} else {
			// skip anything inside an HTML tag
			if (bodyText.lastIndexOf(">", i) >= bodyText.lastIndexOf("<", i)) {
				// skip anything inside a <script> block
				if (lcBodyText.lastIndexOf("/script>", i) >= lcBodyText.lastIndexOf("<script", i)) {
					newText += bodyText.substring(0, i) + highlightStartTag + bodyText.substr(i, searchTerm.length) + highlightEndTag;
					bodyText = bodyText.substr(i + searchTerm.length);
					lcBodyText = bodyText.toLowerCase();
					i = -1;
				}
			}
		}
	}

	return newText;
}


/*
* This is sort of a wrapper function to the doHighlight function.
* It takes the searchText that you pass, optionally splits it into
* separate words, and transforms the text on the current web page.
* Only the "searchText" parameter is required; all other parameters
* are optional and can be omitted.
*/
/**
 * description...
 * Date :
 *
 * @param searchText
 * @param treatAsPhrase
 * @param warnOnFailure
 * @param highlightStartTag
 * @param highlightEndTag
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function highlightSearchTerms(searchText, treatAsPhrase, warnOnFailure, highlightStartTag, highlightEndTag) {
	// if the treatAsPhrase parameter is true, then we should search for
	// the entire phrase that was entered; otherwise, we will split the
	// search string so that each word is searched for and highlighted
	// individually
	if (treatAsPhrase) {
		searchArray = [searchText];
	} else {
		searchArray = searchText.split(" ");
	}

	if (!document.body || typeof(document.body.innerHTML) == "undefined") {
		if (warnOnFailure) {
			alert("Sorry, for some reason the text of this page is unavailable. Searching will not work.");
		}
		return false;
	}

	var bodyText = document.body.innerHTML;
	for (var i = 0; i < searchArray.length; i++) {
		bodyText = doHighlight(bodyText, searchArray[i], highlightStartTag, highlightEndTag);
	}

	document.body.innerHTML = bodyText;
	return true;
}


/*
 * This displays a dialog box that allows a user to enter their own
 * search terms to highlight on the page, and then passes the search
 * text or phrase to the highlightSearchTerms function. All parameters
 * are optional.
 */
/**
 * description...
 * Date :
 *
 * @param defaulttext
 * @param treatAsPhrase
 * @param textColor
 * @param bgColor
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function searchPrompt(defaultText, treatAsPhrase, textColor, bgColor) {
	// This function prompts the user for any words that should
	// be highlighted on this web page
	if (!defaultText) {
		defaultText = "";
	}

	// we can optionally use our own highlight tag values
	if ((!textColor) || (!bgColor)) {
		highlightStartTag = "";
		highlightEndTag = "";
	} else {
		highlightStartTag = "<font style='color:" + textColor + "; background-color:" + bgColor + ";'>";
		highlightEndTag = "</font>";
	}

	if (treatAsPhrase) {
		promptText = "Please enter the phrase you'd like to search for:";
	} else {
		promptText = "Please enter the words you'd like to search for, separated by spaces:";
	}

	searchText = prompt(promptText, defaultText);

	if (!searchText)  {
		alert("No search terms were entered. Exiting function.");
		return false;
	}

	return highlightSearchTerms(searchText, treatAsPhrase, true, highlightStartTag, highlightEndTag);
}


/*
 * This function takes a referer/referrer string and parses it
 * to determine if it contains any search terms. If it does, the
 * search terms are passed to the highlightSearchTerms function
 * so they can be highlighted on the current page.
 */
/**
 * description...
 * Date :
 *
 * @param referrer
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function highlightGoogleSearchTerms(referrer) {
	// This function has only been very lightly tested against
	// typical Google search URLs. If you wanted the Google search
	// terms to be automatically highlighted on a page, you could
	// call the function in the onload event of your <body> tag,
	// like this:
	//   <body onload='highlightGoogleSearchTerms(document.referrer);'>

	//var referrer = document.referrer;
	if (!referrer) {
		return false;
	}

	var queryPrefix = "q=";
	var startPos = referrer.toLowerCase().indexOf(queryPrefix);
	if ((startPos < 0) || (startPos + queryPrefix.length == referrer.length)) {
		return false;
	}

	var endPos = referrer.indexOf("&", startPos);
	if (endPos < 0) {
		endPos = referrer.length;
	}

	var queryString = referrer.substring(startPos + queryPrefix.length, endPos);
	// fix the space characters
	queryString = queryString.replace(/%20/gi, " ");
	queryString = queryString.replace(/\+/gi, " ");
	// remove the quotes (if you're really creative, you could search for the
	// terms within the quotes as phrases, and everything else as single terms)
	queryString = queryString.replace(/%22/gi, "");
	queryString = queryString.replace(/\"/gi, "");

	return highlightSearchTerms(queryString, false);
}


/*
 * This function is just an easy way to test the highlightGoogleSearchTerms
 * function.
 */
/**
 * description...
 * Date :
 *
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function testHighlightGoogleSearchTerms() {
	var referrerString = "http://www.google.com/search?q=javascript%20highlight&start=0";
	referrerString = prompt("Test the following referrer string:", referrerString);
	return highlightGoogleSearchTerms(referrerString);
}


/* --- BoxOver ---
/* --- v 2.1 17th June 2006
By Oliver Bryant with help of Matthew Tagg
http://boxover.swazz.org */

if (typeof document.attachEvent!='undefined') {
	window.attachEvent('onload',init);
	document.attachEvent('onmousemove',moveMouse);
	document.attachEvent('onclick',checkMove); }
else {
	window.addEventListener('load',init,false);
	document.addEventListener('mousemove',moveMouse,false);
	document.addEventListener('click',checkMove,false);
}

var oDv=document.createElement("div");
var dvHdr=document.createElement("div");
var dvBdy=document.createElement("div");
var windowlock, boxMove, fixposx, fixposy, lockX, lockY, fixx, fixy, ox, oy;
var boxLeft, boxRight, boxTop, boxBottom, evt, mouseX, mouseY, boxOpen, totalScrollTop, totalScrollLeft;
boxOpen = false;
ox = 10;
oy = 10;
lockX = 0;
lockY = 0;
/**
 * description...
 * Date :
 *
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function init() {
	oDv.appendChild(dvHdr);
	oDv.appendChild(dvBdy);
	oDv.style.position = "absolute";
	oDv.style.visibility = 'hidden';
	document.body.appendChild(oDv);
}

/**
 * description...
 * Date :
 *
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function defHdrStyle() {
	dvHdr.innerHTML='<img  style="vertical-align:middle"  src="info.gif">&nbsp;&nbsp;'+dvHdr.innerHTML;
	dvHdr.style.fontWeight='bold';
	dvHdr.style.width='150px';
	dvHdr.style.fontFamily='arial';
	dvHdr.style.border='1px solid #A5CFE9';
	dvHdr.style.padding='3';
	dvHdr.style.fontSize='11';
	dvHdr.style.color='#4B7A98';
	dvHdr.style.background='#D5EBF9';
	dvHdr.style.filter='alpha(opacity=85)'; // IE
	dvHdr.style.opacity='0.85'; // FF
}
/**
 * description...
 * Date :
 *
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function defBdyStyle() {
	dvBdy.style.borderBottom='1px solid #A5CFE9';
	dvBdy.style.borderLeft='1px solid #A5CFE9';
	dvBdy.style.borderRight='1px solid #A5CFE9';
	dvBdy.style.width='150px';
	dvBdy.style.fontFamily='arial';
	dvBdy.style.fontSize='11';
	dvBdy.style.padding='3';
	dvBdy.style.color='#1B4966';
	dvBdy.style.background='#FFFFFF';
	dvBdy.style.filter='alpha(opacity=85)'; // IE
	dvBdy.style.opacity='0.85'; // FF
}
/**
 * description...
 * Date :
 *
 * @param txt
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function checkElemBO(txt) {
	if (!txt || typeof(txt) != 'string') return false;
	if ((txt.indexOf('header')>-1)&&(txt.indexOf('body')>-1)&&(txt.indexOf('[')>-1)&&(txt.indexOf('[')>-1))
		return true;
	else
		return false;
}

/**
 * description...
 * Date :
 *
 * @param curNode
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function scanBO(curNode) {
	if (checkElemBO(curNode.title)) {
		curNode.boHDR=getParam('header',curNode.title);
		curNode.boBDY=getParam('body',curNode.title);
		curNode.boCSSBDY=getParam('cssbody',curNode.title);
		curNode.boCSSHDR=getParam('cssheader',curNode.title);
		curNode.IEbugfix=(getParam('hideselects',curNode.title)=='on')?true:false;
		curNode.fixX=parseInt(getParam('fixedrelx',curNode.title));
		curNode.fixY=parseInt(getParam('fixedrely',curNode.title));
		curNode.absX=parseInt(getParam('fixedabsx',curNode.title));
		curNode.absY=parseInt(getParam('fixedabsy',curNode.title));
		curNode.offY=(getParam('offsety',curNode.title)!='')?parseInt(getParam('offsety',curNode.title)):10;
		curNode.offX=(getParam('offsetx',curNode.title)!='')?parseInt(getParam('offsetx',curNode.title)):10;
		curNode.fade=(getParam('fade',curNode.title)=='on')?true:false;
		curNode.fadespeed=(getParam('fadespeed',curNode.title)!='')?getParam('fadespeed',curNode.title):0.04;
		curNode.delay=(getParam('delay',curNode.title)!='')?parseInt(getParam('delay',curNode.title)):0;
		if (getParam('requireclick',curNode.title)=='on') {
			curNode.requireclick=true;
			document.all?curNode.attachEvent('onclick',showHideBox):curNode.addEventListener('click',showHideBox,false);
			document.all?curNode.attachEvent('onmouseover',hideBox):curNode.addEventListener('mouseover',hideBox,false);
		}
		else {// Note : if requireclick is on the stop clicks are ignored
			if (getParam('doubleclickstop',curNode.title)!='off') {
				document.all?curNode.attachEvent('ondblclick',pauseBox):curNode.addEventListener('dblclick',pauseBox,false);
			}
		if (getParam('singleclickstop',curNode.title)=='on') {
			document.all?curNode.attachEvent('onclick',pauseBox):curNode.addEventListener('click',pauseBox,false);
		}
		}
		curNode.windowLock=getParam('windowlock',curNode.title).toLowerCase()=='off'?false:true;
		curNode.title='';
		curNode.hasbox=1;
	}
	else
		curNode.hasbox=2;
}
/**
 * description...
 * Date :
 *
 * @param param
 * @param list
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function getParam(param,list) {
	var reg = new RegExp('([^a-zA-Z]' + param + '|^' + param + ')\\s*=\\s*\\[\\s*(((\\[\\[)|(\\]\\])|([^\\]\\[]))*)\\s*\\]');
	var res = reg.exec(list);
	var returnvar;
	if(res)
		return res[2].replace('[[','[').replace(']]',']');
	else
		return '';
}
/**
 * Gets left offset of an element
 * Date : 2009
 *
 * @param object elem element will be get left offset
 * @return integer left offset
 *
 * @author Nam.Nguyen <nam.nguyen@vietunion.com.vn>
 * @since function available since version 1.0
 */
function Left(elem){
	var x=0;
	if (elem.calcLeft)
		return elem.calcLeft;
	var oElem=elem;
	while(elem){
		if ((elem.currentStyle)&& (!isNaN(parseInt(elem.currentStyle.borderLeftWidth)))&&(x!=0))
			x+=parseInt(elem.currentStyle.borderLeftWidth);
		x+=elem.offsetLeft;
		elem=elem.offsetParent;
	}
	oElem.calcLeft=x;
	return x;
}

/**
 * Gets top offset of an element
 * Date :
 *
 * @param object elem element will be get top offset
 * @return integer top offset
 *
 * @author Nam.Nguyen <nam.nguyen@vietunion.com.vn>
 * @since function available since version 1.0
 */
function Top(elem){
	var x=0;
	if (elem.calcTop)
		return elem.calcTop;
	var oElem=elem;
	while(elem){
		if ((elem.currentStyle)&& (!isNaN(parseInt(elem.currentStyle.borderTopWidth)))&&(x!=0))
			x+=parseInt(elem.currentStyle.borderTopWidth);
		x+=elem.offsetTop;
		elem=elem.offsetParent;
	}
	oElem.calcTop=x;
	return x;

}

var ah,ab;
/**
 * Applies CSS style to CBE object
 * Date : 2009
 *
 * @return none
 *
 * @author Nam.Nguyen <nam.nguyen@vietunion.com.vn>
 * @since function available since version 1.0
 */
function applyStyles() {
	if (ab) {
		oDv.removeChild(dvBdy);
	}

	if (ah) {
		oDv.removeChild(dvHdr);
	}

	dvHdr=document.createElement("div");
	dvBdy=document.createElement("div");
	CBE.boCSSBDY?dvBdy.className=CBE.boCSSBDY:defBdyStyle();
	CBE.boCSSHDR?dvHdr.className=CBE.boCSSHDR:defHdrStyle();
	dvHdr.innerHTML=CBE.boHDR;
	dvBdy.innerHTML=CBE.boBDY;
	ah=false;
	ab=false;
	if (CBE.boHDR!='') {
		oDv.appendChild(dvHdr);
		ah=true;
	}
	if (CBE.boBDY!=''){
		oDv.appendChild(dvBdy);
		ab=true;
	}
}

var CSE,iterElem,LSE,CBE,LBE, totalScrollLeft, totalScrollTop, width, height ;
var ini=false;

//Customised function for inner window dimension
/**
 * Gets page width and height
 * Date : 2009
 *
 * @return array width and height
 *
 * @author Nam.Nguyen <nam.nguyen@vietunion.com.vn>
 * @since function available since version 1.0
 */
function SHW() {
	if (document.body && (document.body.clientWidth !=0)) {
		width=document.body.clientWidth;
		height=document.body.clientHeight;
	}
	if (document.documentElement && (document.documentElement.clientWidth!=0) && (document.body.clientWidth + 20 >= document.documentElement.clientWidth)) {
		width=document.documentElement.clientWidth;
		height=document.documentElement.clientHeight;
	}
	return [width,height];
}

/**
 * description...
 * Date :
 *
 * @param millis
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function pausecomp(millis) {
	var date = new Date();
	var curDate = null;

	do {
		curDate = new Date();
	} while(curDate - date < millis);
}

var ID = null;
/**
 * description...
 * Date :
 *
 * @param e
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function moveMouse(e) {
	//boxMove=true;


	e?evt=e:evt=event;

	CSE=evt.target?evt.target:evt.srcElement;

	if (!CSE.hasbox) {
		// Note we need to scan up DOM here, some elements like TR don't get triggered as srcElement
		iElem=CSE;
		while ((iElem.parentNode) && (!iElem.hasbox)) {
			scanBO(iElem);
			iElem=iElem.parentNode;
		}
	}

	if ((CSE!=LSE)&&(!isChild(CSE,dvHdr))&&(!isChild(CSE,dvBdy))){
		if (!CSE.boxItem) {
			iterElem=CSE;
			while ((iterElem.hasbox==2)&&(iterElem.parentNode))
				iterElem=iterElem.parentNode;
			CSE.boxItem=iterElem;
		}
		iterElem=CSE.boxItem;
		if (CSE.boxItem&&(CSE.boxItem.hasbox==1))  {
			LBE=CBE;
			CBE=iterElem;
			if (CBE!=LBE) {
				applyStyles();
				if (!CBE.requireclick)
					if (CBE.fade) {
						if (ID!=null)
							clearTimeout(ID);
						ID=setTimeout("fadeIn("+CBE.fadespeed+")",CBE.delay);
					}
					else {
						if (ID!=null)
							clearTimeout(ID);
						COL=1;
						ID=setTimeout("oDv.style.visibility='visible';ID=null;",CBE.delay);
					}
				if (CBE.IEbugfix) {hideSelects();}
				fixposx=!isNaN(CBE.fixX)?Left(CBE)+CBE.fixX:CBE.absX;
				fixposy=!isNaN(CBE.fixY)?Top(CBE)+CBE.fixY:CBE.absY;
				lockX=0;
				lockY=0;
				boxMove=true;
				ox=CBE.offX?CBE.offX:10;
				oy=CBE.offY?CBE.offY:10;
			}
		} else if (!isChild(CSE,dvHdr) && !isChild(CSE,dvBdy) && (boxMove))	{
			// The conditional here fixes flickering between tables cells.
			if ((!isChild(CBE,CSE)) || (CSE.tagName!='TABLE')) {
				CBE=null;
				if (ID!=null)
					clearTimeout(ID);
				fadeOut();
				showSelects();
			}
		}
		LSE=CSE;
	} else if (((isChild(CSE,dvHdr) || isChild(CSE,dvBdy))&&(boxMove))) {
		totalScrollLeft=0;
		totalScrollTop=0;

		iterElem=CSE;
		while(iterElem) {
			if(!isNaN(parseInt(iterElem.scrollTop))) {
				totalScrollTop+=parseInt(iterElem.scrollTop);
			}

			if(!isNaN(parseInt(iterElem.scrollLeft))) {
				totalScrollLeft+=parseInt(iterElem.scrollLeft);
			}

			iterElem=iterElem.parentNode;
		}
		if (CBE != null) {
			boxLeft=Left(CBE)-totalScrollLeft;
			boxRight=parseInt(Left(CBE)+CBE.offsetWidth)-totalScrollLeft;
			boxTop=Top(CBE)-totalScrollTop;
			boxBottom=parseInt(Top(CBE)+CBE.offsetHeight)-totalScrollTop;
			doCheck();
		}
	}

	if (boxMove&&CBE) {
		// This added to alleviate bug in IE6 w.r.t DOCTYPE
		bodyScrollTop=document.documentElement&&document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop;
		bodyScrollLet=document.documentElement&&document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft;
		mouseX=evt.pageX?evt.pageX-bodyScrollLet:evt.clientX-document.body.clientLeft;
		mouseY=evt.pageY?evt.pageY-bodyScrollTop:evt.clientY-document.body.clientTop;
		if ((CBE)&&(CBE.windowLock)) {
			mouseY < -oy?lockY=-mouseY-oy:lockY=0;
			mouseX < -ox?lockX=-mouseX-ox:lockX=0;
			mouseY > (SHW()[1]-oDv.offsetHeight-oy)?lockY=-mouseY+SHW()[1]-oDv.offsetHeight-oy:lockY=lockY;
			mouseX > (SHW()[0]-dvBdy.offsetWidth-ox)?lockX=-mouseX-ox+SHW()[0]-dvBdy.offsetWidth:lockX=lockX;
		}
		oDv.style.left=((fixposx)||(fixposx==0))?fixposx:bodyScrollLet+mouseX+ox+lockX+"px";
		oDv.style.top=((fixposy)||(fixposy==0))?fixposy:bodyScrollTop+mouseY+oy+lockY+"px";

	}
}

/**
* description...
* Date :
*
* @return unknown_type
*
* @author ...<...@vietunion.com.vn>
* @since function available since version 1.0
*/
function doCheck() {
	if (   (mouseX < boxLeft) || (mouseX > boxRight) || (mouseY < boxTop) || (mouseY > boxBottom)) {
		if (!CBE.requireclick) {
			fadeOut();
		}

		if (CBE.IEbugfix) {
			showSelects();
		}

		CBE = null;
	}
}
/**
 * description...
 * Date :
 *
 * @param e
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function pauseBox(e) {
	e?evt=e:evt=event;
	boxMove=false;
	evt.cancelBubble=true;
}
/**
 * description...
 * Date :
 *
 * @param e
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function showHideBox(e) {
	oDv.style.visibility=(oDv.style.visibility!='visible')?'visible':'hidden';
}

/**
 * description...
 * Date :
 *
 * @param e
 * @return unknown_type
 *
 * @author
 * @since function available since version 1.0
 */
function hideBox(e) {
	oDv.style.visibility = 'hidden';
}

var COL = 0;
var stopfade = false;
/**
 * description...
 * Date :
 *
 * @param fs
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function fadeIn(fs) {
	ID = null;
	COL = 0;
	oDv.style.visibility = 'visible';
	fadeIn2(fs);
}
/**
 * description...
 * Date : 2008
 *
 * @param fs
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function fadeIn2(fs) {
	COL = COL + fs;
	COL = (COL > 1)?1:COL;
	oDv.style.filter = 'alpha(opacity='+parseInt(100 * COL)+')';
	oDv.style.opacity = COL;
	if (COL < 1) {
		setTimeout("fadeIn2("+fs+")",20);
	}
}

/**
 * description...
 * Date :
 *
 * @param pos
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function fadeOut() {
	oDv.style.visibility = 'hidden';

}
/**
 * description...
 * Date :
 *
 * @param s
 * @param d
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function isChild(s, d) {
	while(s) {
		if (s == d) {
			return true;
		}
		s = s.parentNode;
	}
	return false;
}

var cSrc;
/**
 * description...
 * Date :
 *
 * @param e
 * @return unknown_type
 *
 * @author ...<...@vietunion.com.vn>
 * @since function available since version 1.0
 */
function checkMove(e) {
	e?evt = e:evt = event;
	cSrc = evt.target?evt.target:evt.srcElement;

	if ((!boxMove) && (!isChild(cSrc,oDv))) {
		fadeOut();
		if (CBE && CBE.IEbugfix) {
			showSelects();
		}
		boxMove = true;
		CBE = null;
	}
}
/**
 * Shows all SELECT elements on a page
 * Date : 2008
 *
 * @return none
 *
 * @author Nam.Nguyen <nam.nguyen@vietunion.com.vn>
 * @since function available since version 1.0
 */
function showSelects(){
	var elements = document.getElementsByTagName("select");
	for (i=0;i< elements.length;i++){
		elements[i].style.visibility='visible';
	}
}
/**
 * Hides all SELECT elements on a page
 * Date : 2008
 *
 * @return none
 *
 * @author Nam.Nguyen <nam.nguyen@vietunion.com.vn>
 * @since function available since version 1.0
 */
function hideSelects(){
	var elements = document.getElementsByTagName("select");
	for (i = 0;i < elements.length; i++){
		elements[i].style.visibility = 'hidden';
	}
}


/**
 * end tool tips
 */

/**
 * scroll
 */
var lft = 10;  // (window.screen.width/2);
var pos = 0;  // initial top position
var stp = 10;  // step increment size
var spd = 100; // speed of increment
var upr = 0;   // upper limiter
var lwr = 100; // lower limiter
var tim;       // timer variable
/**
 * Scrolls down a element
 * Date : 2008
 * @return none
 *
 * @author Tri.Le <tri.le@vietunion.com.vn>
 * @since function available since version 1.0
 */
function scroll_dn() {
	var b = get_height('divTxt');
	var a = get_height('scrollArea');
	var lwr = a - b;

	if(pos > lwr) {
		pos -= stp;
	}
	do_scroll(pos);
	tim = setTimeout("scroll_dn()", spd);
}

/**
 * Gets height of a element
 * Date : 2008
 *
 * @param string id element ID to get height
 * @return integer element height
 *
 * @author Tri.Le <tri.le@vietunion.com.vn>
 * @since function available since version 1.0
 */
function get_height(id)
{
	return document.getElementById(id).offsetHeight;
}
/**
 * Scrolls up a element
 * Date : 2008
 *
 * @return none
 *
 * @author Tri.Le <tri.le@vietunion.com.vn>
 * @since function available since version 1.0
 */
function scroll_up() {
	if(pos < upr) {
		pos += stp;
	}
	do_scroll(pos);
	tim = setTimeout("scroll_up()", spd);
}
/**
 * Scrolls up/down a element name divTxt
 * Date : 2008
 *
 * @param pos
 * @return none
 *
 * @author Tri.Le <tri.le@vietunion.com.vn>
 * @since function available since version 1.0
 */
function do_scroll(pos) {
	var a = document.getElementById("divTxt");
	a.style.top = pos + 'px';
}
/**
 * Stop scrolling
 * Date : 2008
 *
 * @return none
 *
 * @author Tri.Le <tri.le@vietunion.com.vn>
 * @since function available since version 1.0
 */
function no_scroll() {
	clearTimeout(tim);
}
/**
 * end scroll
 */

//preload image
p1= new Image(15,15);
p1.src="data/interface/v1_0/img/del.gif";

p2= new Image(15,15);
p2.src="data/interface/v1_0/img/check.gif";

p3= new Image(15,15);
p3.src="data/interface/v1_0/img/check2.png";

/**
 * Hash a string into Secure Hash Algorithm
 * Date : 2009
 *
 * @param string s string to be hashed
 * @return string hashed string
 *
 * @author Angel Marin
 * @author Paul Johnston
 * @since function available since version 1.0
 */
function SHA256(s){

	var chrsz   = 8;
	var hexcase = 0;

	function safe_add (x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	}

	function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
	function R (X, n) { return ( X >>> n ); }
	function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
	function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
	function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
	function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
	function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
	function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }

	function core_sha256 (m, l) {
		var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
		var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
		var W = new Array(64);
		var a, b, c, d, e, f, g, h, i, j;
		var T1, T2;

		m[l >> 5] |= 0x80 << (24 - l % 32);
		m[((l + 64 >> 9) << 4) + 15] = l;

		for ( var i = 0; i<m.length; i+=16 ) {
			a = HASH[0];
			b = HASH[1];
			c = HASH[2];
			d = HASH[3];
			e = HASH[4];
			f = HASH[5];
			g = HASH[6];
			h = HASH[7];

			for ( var j = 0; j<64; j++) {
				if (j < 16) W[j] = m[j + i];
				else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

				T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
				T2 = safe_add(Sigma0256(a), Maj(a, b, c));

				h = g;
				g = f;
				f = e;
				e = safe_add(d, T1);
				d = c;
				c = b;
				b = a;
				a = safe_add(T1, T2);
			}

			HASH[0] = safe_add(a, HASH[0]);
			HASH[1] = safe_add(b, HASH[1]);
			HASH[2] = safe_add(c, HASH[2]);
			HASH[3] = safe_add(d, HASH[3]);
			HASH[4] = safe_add(e, HASH[4]);
			HASH[5] = safe_add(f, HASH[5]);
			HASH[6] = safe_add(g, HASH[6]);
			HASH[7] = safe_add(h, HASH[7]);
		}
		return HASH;
	}

	function str2binb (str) {
		var bin = Array();
		var mask = (1 << chrsz) - 1;
		for(var i = 0; i < str.length * chrsz; i += chrsz) {
			bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
		}
		return bin;
	}

	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	}

	function binb2hex (binarray) {
		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var str = "";
		for(var i = 0; i < binarray.length * 4; i++) {
			str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
			hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
		}
		return str;
	}

	s = Utf8Encode(s);
	return binb2hex(core_sha256(str2binb(s), s.length * chrsz));

}

// Menu
stuHover = function() {
var cssRule;
var newSelector;
for (var i = 0; i < document.styleSheets.length; i++)
	for (var x = 0; x < document.styleSheets[i].rules.length ; x++)
		{
		cssRule = document.styleSheets[i].rules[x];
		if (cssRule.selectorText.indexOf("LI:hover") != -1)
		{
			 newSelector = cssRule.selectorText.replace(/LI:hover/gi, "LI.iehover");
			document.styleSheets[i].addRule(newSelector , cssRule.style.cssText);
		}
	}

	if (document.getElementById("title_menu") != null) {
		var getElm = document.getElementById("title_menu").getElementsByTagName("LI");
		for (var i=0; i<getElm.length; i++) {
			getElm[i].onmouseover=function() {
				this.className+=" iehover";
			}
			getElm[i].onmouseout=function() {
				this.className=this.className.replace(new RegExp(" iehover\\b"), "");
			}
		}
	}
}
if (window.attachEvent) window.attachEvent("onload", stuHover);




/*--Message---*/
//buyer register
var msg01 ='Vui lòng nhập Mật khẩu.';
var msg02 ='Mật khẩu phải có ít nhất 6 kí tự.';
var msg03 ='Mật khẩu chỉ cho phép nhập chữ và số.';
var msg04 ='Mật khẩu không được trùng với Ngày sinh.';
var msg05 ='Mật khẩu không được trùng với Tên đăng nhập.';
var msg06 ='Vui lòng xác nhận mật khẩu.';
var msg07 ='Mật khẩu xác nhận không hợp lệ.';
var msg08 ='Tên đăng nhập phải có ít nhất 6 kí tự.';
var msg09 ='Vui lòng nhập Tên đăng nhập.';
var msg10 ='Tên đăng nhập không hợp lệ. Vui lòng nhập lại.';//Tên đăng nhập không hợp lệ, chỉ chấp nhận các ký tự chữ, số, ký tự gạch dưới và có ít nhất 1 chữ cái.';
var msg11 ='Ngày sinh không hợp lệ.';
var msg12 ='Vui lòng nhập Nơi cấp.';
var msg13 ='Vui lòng nhập số CMND/Passport.';
var msg14 ='Số CMND/Passport không hợp lệ.';
var msg15 ='Số CMND/Passport phải là chuỗi không quá 15 kí tự.';
var msg16 ='Vui lòng nhập Câu trả lời.';
var msg17 ='Vui lòng nhập Mã xác nhận.';
var msg18 ='Vui lòng chọn Câu hỏi bí mật.';
var msg19 ='Số điện thoại di động không hợp lệ.';
var msg20 ='Số điện thoại di động không hợp lệ.';
var msg21='Số điện thoại di động không hợp lệ.'; // Gom chung msg22 luôn đi
var msg22='Số điện thoại di động không hợp lệ.';
var msg23='Vui lòng nhập địa chỉ email.';
var msg24='Địa chỉ email không hợp lệ.';
var msg25='Vui lòng nhập Địa chỉ.';
var msg26='Vui lòng nhập Họ và Tên.';
//var msg27='Vui lòng nhập Tên.';
var msg28='Bạn chưa đánh dấu đồng ý nội dung.';
//seller register
var msg29='Vui lòng lựa chọn Mặt hàng kinh doanh.';
var msg30='Vui lòng nhập Mật khẩu.'; // Gom chung msg01 luôn đi
var msg31='Mật khẩu phải có ít nhất 6 kí tự.'; // Gom chung msg02 luôn đi
var msg32='Mật khẩu chỉ cho phép nhập chữ và số.'; // msg03
var msg33='Mật khẩu không được trùng với Ngày sinh.'; // msg04
var msg34='Mật khẩu không được trùng với Tên đăng nhập.'; // msg05
var msg35='Vui lòng xác nhận mật khẩu.'; // msg06
var msg36='Mật khẩu xác nhận không hợp lệ.'; // msg07
var msg37='Ngày sinh không hợp lệ.'; // msg11
var msg38='Tên đăng nhập phải có ít nhất 6 kí tự.';
var msg39='Vui lòng nhập Tên đăng nhập.';
var msg40='Vui lòng nhập Mã xác nhận.';
var msg41='Tên đăng nhập không hợp lệ, chỉ chấp nhận các ký tự chữ, số, ký tự gạch dưới và có ít nhất 1 chữ cái.';
var msg42='Vui lòng nhập Nơi cấp.';
var msg43='Vui lòng nhập Số CMND/Passport.';
var msg44='Số CMND/Passport không hợp lệ.';
var msg45='Số CMND/Passport phải là chuỗi 9 chữ số.';
var msg46='Vui lòng nhập Câu trả lời.';
var msg47='Vui lòng chọn Câu hỏi bí mật.';
var msg48='Số điện thoại không hợp lệ.';
var msg49='Số điện thoại không hợp lệ.';
var msg50='Số điện thoại không hợp lệ.';
var msg51='Số điện thoại không hợp lệ.';
var msg52='Địa chỉ email không hợp lệ.';
var msg53='Vui lòng nhập Tên doanh nghiệp.';
var msg54='Vui lòng nhập Địa chỉ doanh nghiệp.';
var msg55='Vui lòng nhập Số điện thoại doanh nghiệp.';
var msg56='Vui lòng nhập Mã số đăng kí doanh nghiệp.';
var msg57='Vui lòng nhập Mã số thuế doanh nghiệp.';
var msg58='Vui lòng nhập Địa chỉ email.';
var msg59='Vui lòng nhập Họ.';
var msg60='Vui lòng nhập Tên.';
var msg61='Bạn chưa đánh dấu đồng ý nội dung.';
//buyer upgrade to seller
var msg62='Vui lòng lựa chọn mặt hàng.';
var msg63='Vui lòng nhập Địa chỉ email của website bán hàng.';
var msg64='Địa chỉ email website bán hàng không hợp lệ.';
var msg65='Vui lòng nhập Địa chỉ website bán hàng.';
var msg66='Vui lòng nhập Mã số thuế doanh nghiệp.';
var msg67='Vui lòng nhập Mã số đăng kí doanh nghiệp.';
var msg68='Địa chỉ email doanh nghiệp không hợp lệ.';
var msg69='Vui lòng nhập Địa chỉ doanh nghiệp.';
var msg70='Vui lòng nhập Tên doanh nghiệp.';
//profiles
var msg71='Vui lòng nhập Nơi cấp.';
//register shop
var msg72='Vui lòng chọn Mặt hàng kinh doanh.';
var msg73='Vui lòng nhập Địa chỉ website.';
var msg74='Địa chỉ email không hợp lệ.';

//////////phan them moi /////////////////////////////
var msg75 ='Vui lòng điền Mã yêu cầu.';
var msg76 ='Vui lòng nhập thông tin cần thay đổi.';
var msg77 ='Mật khẩu chỉ gồm chữ và số.';
var msg78 ='Mật khẩu phải có ít nhất 6 kí tự.';
var msg79 ='Mật khẩu xác nhận không hợp lệ.';
var msg80 ='Vui lòng chọn Câu hỏi bí mật.';
var msg81 ='Vui lòng trả lời Câu hỏi bí mật.';
var msg82 ='Vui lòng nhập Số tài khoản.';
var msg83 ='Vui lòng nhập Số tiền.';
var msg84 ='Vui lòng nhập số từ 0-9.';
var msg85 ='Số tiền không hợp lệ.';
var msg86 = 'Vui lòng nhập số tiền.';
var msg87 ='Vui lòng nhập số từ 0-9.';
var msg88 ='Số tiền không hợp lệ.';
var msg89 ='Vui lòng nhập Mã yêu cầu.';
var msg90 ='Vui lòng nhập mã yêu cầu.';
var msg91 ='Mật khẩu chỉ gồm chữ và số.';
var msg92 ='Mật khẩu phải có ít nhất 6 kí tự.';
var msg93 ='Vui lòng xác nhận mật khẩu.';
var msg94 ='Mật khẩu xác nhận không hợp lệ.';
var msg95 ='Vui lòng điền Mã xác nhận.';
var msg96 ='Vui lòng nhập Số tiền.';
var msg97 ='Vui lòng nhập số từ 0-9.';
var msg98 ='Số tiền không hợp lệ.';
var msg99 ='Vui lòng nhập Số tài khoản.';
var msg100 ='Vui lòng nhập Số tiền.';
var msg101 ='Vui lòng nhập số từ 0-9.';
var msg102 ='Số tiền không hợp lệ.';
var msg103 ='Vui lòng nhập đủ thông tin.';
var msg104 ='Vui lòng nhập số nguyên.';
var msg105 ='Số tiền không hợp lệ.';
var msg106 ='Vui lòng nhập thông tin người nhận.';
var msg107 ='Tên đăng nhập không hợp lệ.';
var msg108 ='Vui lòng nhập Số tiền.';
var msg109 ='Số tiền không hợp lệ.';
/////////////////////////////////////////////////////
var msg110 = 'Ngày cấp CMND/Passport không hợp lệ.';
var msg111 = 'Vui lòng nhập tên website.';
var msg112 = 'Địa chỉ website không hợp lệ.';
var msg113 = 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày hiện tại.';
var msg114 = 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.';
var msg115 = 'Ngày không hợp lệ. Vui lòng nhập lại.';// theo dạng dd/mm/yyyy.';
var msg116 = 'Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại.';
var msg117 = 'Email nhập lại không khớp nhau.';
var msg118 = 'Vui lòng xác nhận email.';
var msg119 = 'Bạn thực sự muốn hủy giao dịch này?';
//Thong bao khi so OTP ko hop le
var msg120 = 'Mã xác thực OTP không hợp lệ, vui lòng nhập lại.';
var msg121 = 'Vui lòng nhập mã xác thực OTP.';
var msg122 = 'Số fax không hợp lệ.';
var msg123 = 'Số điện thoại di động không hợp lệ.';
var msg124 = 'Số điện thoại không hợp lệ.';
var msg125 = ' Bạn chỉ có thể trả lời 1 lần cho câu hỏi của chương trình mỗi kỳ, vì thế Bạn nên kiểm tra kỹ các đáp án của mình trước khi nhấn nút trả lời. Bạn thật sự muốn gửi câu trả lời cho chương trình kỳ này?';
var msg126 = 'Số dự đoán số người trả lời đúng không hợp lệ. Vui lòng nhập lại.';
var msg127 = 'Vui lòng nhập số dự đoán số người trả lời đúng.';
var msg128 = 'Vui lòng trả lời câu hỏi của chương trình.';
var msg129 = 'Vui lòng chọn ít nhất 1 kênh thông tin mà nhờ đó Bạn biết đến chương trình này.';