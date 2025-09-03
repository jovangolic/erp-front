# AccountWithTransactionsResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**accountNumber** | **string** |  | [optional] [default to undefined]
**accountName** | **string** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**balance** | **number** |  | [optional] [default to undefined]
**sourceTransactions** | [**Array&lt;TransactionResponse&gt;**](TransactionResponse.md) |  | [optional] [default to undefined]
**targetTransactions** | [**Array&lt;TransactionResponse&gt;**](TransactionResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { AccountWithTransactionsResponse } from './api';

const instance: AccountWithTransactionsResponse = {
    id,
    accountNumber,
    accountName,
    type,
    balance,
    sourceTransactions,
    targetTransactions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
