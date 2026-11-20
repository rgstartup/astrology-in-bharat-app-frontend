import { describe, it, expect } from "vitest";
import { payoutAccountDisplay } from "./payout-account-details";

describe("payoutAccountDisplay", () => {
  it("bank_account shows masked account + ifsc", () => {
    const { accountLabel, secondary, type } = payoutAccountDisplay(
      { account_number_masked: "1234", bank_name: "HDFC", ifsc: "HDFC0001234" },
      null,
    );
    expect(type).toBe("bank_account");
    expect(accountLabel).toBe("•••• 1234");
    expect(secondary).toBe("HDFC0001234");
  });

  it("bank_account without ifsc shows em dash secondary", () => {
    const { accountLabel, secondary } = payoutAccountDisplay(
      { account_number_masked: "1234", bank_name: "HDFC" },
      null,
    );
    expect(accountLabel).toBe("•••• 1234");
    expect(secondary).toBe("—");
  });

  it("vpa shows vpa_id", () => {
    const { accountLabel, secondary, type } = payoutAccountDisplay(
      { vpa_id: "user@upi" },
      null,
    );
    expect(type).toBe("vpa");
    expect(accountLabel).toBe("user@upi");
    expect(secondary).toBe("—");
  });

  it("wallet shows wallet_handle", () => {
    const { accountLabel, secondary, type } = payoutAccountDisplay(
      { wallet_handle: "wallet_abc" },
      null,
    );
    expect(type).toBe("wallet");
    expect(accountLabel).toBe("wallet_abc");
    expect(secondary).toBe("—");
  });

  it("card shows masked last4 + brand", () => {
    const { accountLabel, secondary, type } = payoutAccountDisplay(
      { last4: "4321", brand: "visa" },
      null,
    );
    expect(type).toBe("card");
    expect(accountLabel).toBe("•••• 4321");
    expect(secondary).toBe("visa");
  });

  it("card without brand shows em dash secondary", () => {
    const { accountLabel, secondary } = payoutAccountDisplay(
      { last4: "4321" },
      null,
    );
    expect(accountLabel).toBe("•••• 4321");
    expect(secondary).toBe("—");
  });

  it("null details falls back to externalAccountId", () => {
    const { accountLabel, secondary, type } = payoutAccountDisplay(
      null,
      "ext_acct_1",
    );
    expect(type).toBe("other");
    expect(accountLabel).toBe("ext_acct_1");
    expect(secondary).toBe("—");
  });

  it("empty details falls back to em dash", () => {
    const { accountLabel, secondary, type } = payoutAccountDisplay({}, null);
    expect(type).toBe("other");
    expect(accountLabel).toBe("—");
    expect(secondary).toBe("—");
  });

  it("unknown details keys fall back to externalAccountId", () => {
    const { accountLabel, secondary, type } = payoutAccountDisplay(
      { foo: "bar" },
      "ext_acct_2",
    );
    expect(type).toBe("other");
    expect(accountLabel).toBe("ext_acct_2");
    expect(secondary).toBe("—");
  });
});
