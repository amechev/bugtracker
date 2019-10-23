import {JsonObject, JsonProperty} from 'ta-json';

@JsonObject()
export class Status {
  @JsonProperty('_id')
  id?: string;

  @JsonProperty('type')
  type?: string;

  @JsonProperty('name')
  name?: string;

  constructor(
    id?: string,
    type?: string,
    name?: string
  ) {
    this.id = id;
    this.type = type;
    this.name = name;
  }
}
