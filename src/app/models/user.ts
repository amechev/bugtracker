import {JSON, JsonElementType, JsonObject, JsonProperty, OnDeserialized} from 'ta-json';

/**
 * Модель краткого представления пользователя
 */
@JsonObject()
export class UserShort {
  /** Уникальный идентификатор */
  @JsonProperty()
  id: string;
  /** Имя */
  @JsonProperty('first_name')
  firstName: string;
  /** Отчество, если есть */
  @JsonProperty('middle_name')
  middleName?: string;
  /** Фамилия */
  @JsonProperty('last_name')
  lastName: string;
  /** Идентификатор 1с */
  @JsonProperty()
  c_user_id: string;
  /** Фото */
  photo: string | null = null;

  constructor(id?: string, firstName?: string, middleName?: string, lastName?: string, photo?: string | null) {
    this.id = id;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.photo = photo;
  }

  get shortName() {
    let short = this.lastName;
    if (this.firstName) {
      short += ' ' + this.firstName.slice(0, 1) + '.';
      if (this.middleName) {
        short += ' ' + this.middleName.slice(0, 1) + '.';
      }
    }
    return short;
  }

  get name() {
    let fullName = this.lastName;
    if (this.firstName) {
      fullName += ' ' + this.firstName;
      if (this.middleName) {
        fullName += ' ' + this.middleName;
      }
    }
    return fullName;
  }
}


@JsonObject()
export class Membership {
  @JsonProperty('org_unit_id')
  orgUnitId: string;
  @JsonProperty()
  position = '';
}

@JsonObject()
export class User {
  @JsonProperty()
  id: number;
  @JsonProperty()
  c_circle_id: string;
  @JsonProperty()
  c_user_id: string;
  @JsonProperty()
  user_id: number | null = null;
  @JsonProperty()
  first_name = '';
  @JsonProperty()
  middle_name: string | null = null;
  @JsonProperty()
  last_name = '';
  @JsonProperty()
  photo: string | null = null;
  @JsonProperty()
  birthday: string | null;
  @JsonProperty()
  home_phone: string | null = null;
  @JsonProperty()
  work_phone: string | null = null;
  @JsonProperty()
  internal_phone: string | null = null;
  @JsonProperty()
  location: string | null = null;
  @JsonProperty()
  comment: string | null = null;
  @JsonProperty()
  home_email: string | null = null;
  @JsonProperty()
  home_email_verified: boolean;
  @JsonProperty()
  work_email: string | null = null;
  @JsonProperty()
  work_email_verified: boolean;
  @JsonProperty()
  @JsonElementType(Membership)
  memberships: Membership[];

  /** Удаляет из номера телефона все не-цифры - унифицирует формат номера */
  @OnDeserialized()
  transform() {
    this.home_phone = this.home_phone ? this.home_phone.replace(/\D/g, '') : '';
    this.work_phone = this.work_phone ? this.work_phone.replace(/\D/g, '') : '';
    this.internal_phone = this.internal_phone ? this.internal_phone.replace(/\D/g, '') : '';
  }

  getFullName() {
    return this.last_name + ' ' + this.first_name + (this.middle_name ? ' ' + this.middle_name : '');
  }
}
