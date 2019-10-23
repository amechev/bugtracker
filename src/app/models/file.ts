import {JsonObject, JsonProperty} from 'ta-json';

@JsonObject()
export class File {
  @JsonProperty('id')
  id?: string;

  @JsonProperty('name')
  name?: string;

  @JsonProperty('url')
  url?: string;

  @JsonProperty('created_by')
  createdBy?: string;

  @JsonProperty('is_deletable')
  isDeletable?: boolean;


  constructor(
    id?: string,
    name?: string,
    url?: string,
    createdBy?: string,
    isDeletable?: boolean
  ) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.createdBy = createdBy;
    this.isDeletable = isDeletable;
  }
}
