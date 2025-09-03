# Batch


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**code** | **string** |  | [optional] [default to undefined]
**product** | [**Product**](Product.md) |  | [optional] [default to undefined]
**quantityProduced** | **number** |  | [optional] [default to undefined]
**productionDate** | **string** |  | [optional] [default to undefined]
**expiryDate** | **string** |  | [optional] [default to undefined]
**inspections** | [**Array&lt;Inspection&gt;**](Inspection.md) |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**modifiedAt** | **string** |  | [optional] [default to undefined]
**createdBy** | **string** |  | [optional] [default to undefined]
**modifiedBy** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { Batch } from './api';

const instance: Batch = {
    id,
    code,
    product,
    quantityProduced,
    productionDate,
    expiryDate,
    inspections,
    createdAt,
    modifiedAt,
    createdBy,
    modifiedBy,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
