import {
  addYearsToDate,
  getFormattedDate,
  getFormattedDateToTime,
} from './date-functions';

describe('date-functions', () => {
  describe('addYearsToDate', () => {
    it('should add years to a date', () => {
      const initialDate = new Date(2022, 0, 1);
      const result = addYearsToDate(initialDate, 5);
      expect(result.getFullYear()).toBe(2027);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });
  });

  describe('getFormattedDate', () => {
    it('should parse a date string and return a Date object', () => {
      const dateString = '01/01/2022';
      const result = getFormattedDate(dateString);
      expect(result?.getFullYear()).toBe(2022);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(1);
    });

    it('should handle date string with different formats using /', () => {
      const dateString = '01/01/2022';
      const result = getFormattedDate(dateString);
      expect(result?.getFullYear()).toBe(2022);
      expect(result?.getMonth()).toBe(0);
      expect(result?.getDate()).toBe(1);
    });
  });

  describe('getFormattedDateToTime', () => {
    it('should convert a date string to time', () => {
      const dateString = '01/01/2022';
      const result = getFormattedDateToTime(dateString);
      expect(result).toBe(new Date(2022, 0, 1).getTime());
    });

    it('should handle date string with different formats using -', () => {
      const dateString = '01-01-2022';
      const result = getFormattedDateToTime(dateString);
      expect(result).toBe(new Date(2022, 0, 1).getTime());
    });
  });
});
