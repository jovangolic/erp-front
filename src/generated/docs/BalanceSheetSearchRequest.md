# BalanceSheetSearchRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**startDate** | **string** |  | [optional] [default to undefined]
**endDate** | **string** |  | [optional] [default to undefined]
**fiscalYearId** | **number** |  | [optional] [default to undefined]
**minAssets** | **number** |  | [optional] [default to undefined]
**minEquity** | **number** |  | [optional] [default to undefined]
**minLiabilities** | **number** |  | [optional] [default to undefined]
**onlySolvent** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { BalanceSheetSearchRequest } from './api';

const instance: BalanceSheetSearchRequest = {
    startDate,
    endDate,
    fiscalYearId,
    minAssets,
    minEquity,
    minLiabilities,
    onlySolvent,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
