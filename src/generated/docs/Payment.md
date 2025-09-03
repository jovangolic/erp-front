# Payment


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**amount** | **number** |  | [optional] [default to undefined]
**paymentDate** | **string** |  | [optional] [default to undefined]
**method** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**referenceNumber** | **string** |  | [optional] [default to undefined]
**buyer** | [**Buyer**](Buyer.md) |  | [optional] [default to undefined]
**relatedSales** | [**Sales**](Sales.md) |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**modifiedAt** | **string** |  | [optional] [default to undefined]
**createdBy** | **string** |  | [optional] [default to undefined]
**modifiedBy** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { Payment } from './api';

const instance: Payment = {
    id,
    amount,
    paymentDate,
    method,
    status,
    referenceNumber,
    buyer,
    relatedSales,
    createdAt,
    modifiedAt,
    createdBy,
    modifiedBy,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
