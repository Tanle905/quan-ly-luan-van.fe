const formatDataToEvent = (bookings: any[]) => {
    let events = bookings.map((booking: { appointment: moment.MomentInput; organization: { timezone: any; }; id: any; serviceHours: any; }) => {
      const marker = moment(booking.appointment).tz(
        booking.organization.timezone || DEFAULT_TIMEZONE
      );
      const formatDate =
        STANDARD_FORMAT_DATE_TYPE + ' ' + STANDARD_FORMAT_TIME_MINUTE;
      return {
        data: { ...booking },
        title: booking.id,
        start: marker.format(formatDate),
        end: marker.add(booking.serviceHours, 'h').format(formatDate),
      };
    });
    return events;
  };

  const formatDataForChart = (bookings: any, serviceCount: any) => {
    let dataChart = services?.items?.map((service: { name: any; }) => ({
      type: service.name,
      value: 0,
    }));

    (bookings || []).map((booking: { bookingServices: any; }) =>
      (booking.bookingServices || []).map((service: { service: { name: any; }; bookingPackages: string | any[]; }) => {
        dataChart = (dataChart || []).map((data: { type: any; value: any; }) =>
          data.type == service.service.name
            ? { ...data, value: data.value + service.bookingPackages.length }
            : data
        );
      })
    );
    return (dataChart || []).filter((data: { value: number; }) => data.value > 0);
  };

  const formatDataToEventMonthView = (data: { [x: string]: any; }) => {
    let events = [];
    if (dateRange) {
      let startDate = dateRange && dateRange.startDate;
      while (moment(startDate).isSameOrBefore(moment(dateRange?.endDate))) {
        const currentDate = moment(startDate).format(STANDARD_FORMAT_DATE_TYPE);
        events.push({
          dataChart: data[currentDate]
            ? formatDataForChart(
                data[currentDate].items,
                data[currentDate].serviceCount
              )
            : [],
          data: data[currentDate] ? data[currentDate] : null,
          title: currentDate,
          start: moment(startDate).toISOString(),
        });
        startDate = moment(startDate).add(1, 'd');
      }
    }
    return events;
  };