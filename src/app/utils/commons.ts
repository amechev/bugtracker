
import {environment} from '../../environments/environment';



/***************** функции связанные с датами*******************/

/**
 * Валидная ли дата
 * @params date
 */
export function dateIsValid(date: Date) {
  return date && (date instanceof Date) && !isNaN(date.getTime());
}

/**
 * Возвращает истину, если это один день(без учета времени)
 * @params date1
 * @params date2
 */
export function areOneDay(date1: Date, date2: Date): boolean {
  if (!dateIsValid(date1) || !dateIsValid(date2)) {
    return false;
  }
  return (
    new Date(date1.getFullYear(),
    date1.getMonth(),
    date1.getDay())
  ).getTime() === (
    new Date(date2.getFullYear(),
    date2.getMonth(),
    date2.getDay())
  ).getTime();
}

/********************** Прочие функции ****************************/
export function hashCode(str: string) {
  let hash = 0, i, chr;
  if (str.length === 0) {
    return hash;
  }
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

