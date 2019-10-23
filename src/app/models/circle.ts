import {JSON, JsonElementType, JsonObject, JsonProperty, OnDeserialized} from 'ta-json';

@JsonObject()
export class Circle {
  @JsonProperty('id')
  id?: string;
  @JsonProperty('active')
  active: boolean;
  @JsonProperty('name')
  name: string | null = null;
  @JsonProperty('description')
  description: string | null = null;
  @JsonProperty('product_id')
  productId: string | null = null;

  constructor(
    id?: string,
    active?: boolean,
    name?: string,
    description?: string,
    productId?: string
  ) {
    this.id = id;
    this.active = active;
    this.name = name;
    this.description = description;
    this.productId = productId;
  }
}
