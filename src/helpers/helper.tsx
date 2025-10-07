export const formatDate = (dateString: string) => {
    const date = new Date(dateString); // Convert the string to a Date object
    
    // Manually format the date as 'DD/MM/YYYY HH:mm:ss'
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Combine into desired format
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export const formatDateOnly = (dateString:string) => {
    if (!dateString) return ""; // Return an empty string if no date is provided
  
    // Assuming dateString is in the format "yyyy-mm-dd" or "yyyy/mm/dd"
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return dateString; // Return original if invalid date
    
    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, '0'); // Pad single digit days
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`; // Return in the format dd/mm/yyyy
  };
  
  