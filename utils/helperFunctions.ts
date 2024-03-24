export const formatter = (
    number: any,
    language = "en",
    currency = "EUR",
    simpleNumber: any,
    minimumFractionDigits = 2,
    maximumFractionDigits = 20
) => {
    const languages: any = {
        en: "GB",
        de: "DE",
    };
    let formattedNumber = number;
    try {
        let obj = {};
        if (!simpleNumber) {
            obj = {
                style: "currency",
                currency: currency,
            };
        }
        formattedNumber = new Intl.NumberFormat(
            language + "-" + languages[language],
            {
                ...obj,
                minimumFractionDigits: minimumFractionDigits,
                maximumFractionDigits: maximumFractionDigits,
            }
        ).format(number);
    } catch (e) {
        console.log(e);
    } finally {
        return formattedNumber;
    }
};

export const dateFormatter = (date: any) => {
    if (!date) return "";
    const output = new Date(date)
    return output.toLocaleString(['en-US'], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
};

export const formatDateLite = (date: any) => {
    try {
        const m = date.getMonth() + 1;
        const d = date.getDate();
        return `${date.getFullYear()}-${m < 10 ? "0" : ""}${m}-${d < 10 ? "0" : ""
            }${d}`;
    } catch (e) {
        return date;
    }
};


export const capitalize = (string: any) => {
    if (!string) return "";
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
};

export const getEndTime = (startTime: string, hours: any) => {
    //Get end time
    const startDateTime = new Date(`2000-01-01T${startTime}`);
    const duration = parseFloat(String(hours).replace(",", "."));
    const getTime = new Date(
        startDateTime.getTime() + duration * 60 * 60 * 1000
    );

    // Format the end time as a string in the format "hh:mm"
    return getTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const diff = (startTime: any, endTime: any) => {
    let start = startTime;
    let end = endTime;

    start = start?.split(":") ?? "";
    end = end?.split(":") ?? "";
    var startDate = new Date(0, 0, 0, start[0], start[1], 0);
    var endDate = new Date(0, 0, 0, end[0], end[1], 0);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = diff / 1000 / 60 / 60;
    diff -= hours * 1000 * 60 * 60;
    return isNaN(hours) ? 0 : hours;
}

export const numberFormatter = (format: any, value: any, minimumFractionDigits: any, maximumFractionDigits: any) => {
    let formattedNumber = value;
    if (format === "en") {
        formattedNumber = new Intl.NumberFormat("en-GB", {
            minimumFractionDigits: minimumFractionDigits,
            maximumFractionDigits: maximumFractionDigits,
        }).format(value);
    } else if (format === "de") {
        formattedNumber = new Intl.NumberFormat("de-DE", {
            minimumFractionDigits: minimumFractionDigits,
            maximumFractionDigits: maximumFractionDigits,
        }).format(value);
    }
    return formattedNumber;
}

export const reportDateFormatter = (dateString: any, format='') => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `(${year}-${month}-${day})`;
}
