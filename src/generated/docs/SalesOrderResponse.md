# SalesOrderResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**orderNumber** | **string** |  | [optional] [default to undefined]
**buyerResponse** | [**BuyerResponse**](BuyerResponse.md) |  | [optional] [default to undefined]
**itemSales** | [**Array&lt;ItemSalesForSalesOrderResponse&gt;**](ItemSalesForSalesOrderResponse.md) |  | [optional] [default to undefined]
**orderDate** | **string** |  | [optional] [default to undefined]
**totalAmount** | **number** |  | [optional] [default to undefined]
**invoiceForSalesOrderResponse** | [**InvoiceForSalesOrderResponse**](InvoiceForSalesOrderResponse.md) |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**note** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { SalesOrderResponse } from './api';

const instance: SalesOrderResponse = {
    id,
    orderNumber,
    buyerResponse,
    itemSales,
    orderDate,
    totalAmount,
    invoiceForSalesOrderResponse,
    status,
    note,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
