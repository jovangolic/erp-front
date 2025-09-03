# BatchResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**code** | **string** |  | [optional] [default to undefined]
**productResponse** | [**ProductResponse**](ProductResponse.md) |  | [optional] [default to undefined]
**quantityProduced** | **number** |  | [optional] [default to undefined]
**productionDate** | **string** |  | [optional] [default to undefined]
**expiryDate** | **string** |  | [optional] [default to undefined]
**inspections** | [**Array&lt;InspectionResponse&gt;**](InspectionResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { BatchResponse } from './api';

const instance: BatchResponse = {
    id,
    code,
    productResponse,
    quantityProduced,
    productionDate,
    expiryDate,
    inspections,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
