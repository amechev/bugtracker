import {JsonElementType, JsonObject, JsonProperty} from 'ta-json';
import {Circle} from './circle';
import {Status} from './status';
import {File} from './file';
import {User} from './user';


@JsonObject()
export class Task {
  @JsonProperty('_id')
  id?: string;

  @JsonProperty('performer_subdivision')
  @JsonElementType(Circle)
  subdivision: Circle;

  @JsonProperty('status')
  @JsonElementType(Status)
  status: Status;

  @JsonProperty('registration_number')
  number?: string;

  @JsonProperty('name')
  name?: string;

  @JsonProperty('created_at')
  createdAt?: string;

  @JsonProperty('completion_at')
  completionAt?: string;

  @JsonProperty('is_important')
  isImportant?: boolean;

  @JsonProperty('comment')
  description?: string;

  @JsonProperty('files')
  @JsonElementType(File)
  files: File[];

  @JsonProperty('created_by')
  createdBy?: string;

  @JsonProperty('author')
  @JsonElementType(User)
  author: User;

  @JsonProperty('performer')
  @JsonElementType(User)
  performer: User;

  @JsonProperty('type')
  type: string;

  constructor(
    id?: string,
    subdivision?: Circle,
    status?: Status,
    number?: string,
    name?: string,
    createdAt?: string,
    completionAt?: string,
    isImportant?: boolean,
    description?: string,
    files?: File[],
    createdBy?: string,
    author?: User,
    performer?: User,
    type?: string
  ) {
    this.id = id;
    this.subdivision = subdivision;
    this.status = status;
    this.number = number;
    this.name = name;
    this.createdAt = createdAt;
    this.completionAt = completionAt;
    this.isImportant = isImportant;
    this.description = description;
    this.files = files;
    this.createdBy = createdBy;
    this.author = author;
    this.performer = performer;
    this.type = type;
  }
}

export const TaskTypes = Object.freeze( [
    {
      type: 'MY_TASK',
      name: 'Мои задачи',
    },
    {
      type: 'MY_REQUEST',
      name: 'Созданные мной',
    },
    {
      type: 'MY_SUB_DIVISION',
      name: 'Задачи моего круга',
    },
  ]
)
