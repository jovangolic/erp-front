# PaymentResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**amount** | **number** |  | [optional] [default to undefined]
**paymentDate** | **string** |  | [optional] [default to undefined]
**method** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**referenceNumber** | **string** |  | [optional] [default to undefined]
**buyer** | [**BuyerResponse**](BuyerResponse.md) |  | [optional] [default to undefined]
**relatedSales** | [**SalesResponse**](SalesResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { PaymentResponse } from './api';

const instance: PaymentResponse = {
    id,
    amount,
    paymentDate,
    method,
    status,
    referenceNumber,
    buyer,
    relatedSales,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
