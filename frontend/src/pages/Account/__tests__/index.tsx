
import { expect, describe, it, vi } from "vitest";
import "@testing-library/jest-dom";
import { Account } from "../..";
import { render } from "@testing-library/react";


vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: () => ({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: "3c874ab2-8eb2-4b2c-95e9-0559e63f9666",
              email: "demo@jobtrackr.online",
            },
          },
          error: null,
        }),
      },
    }),
  };
});

describe("Account Page", () => {
  it("renders without crashing", () => {
    const { container } = render(<Account />);
    expect(container).toBeInTheDocument();
  });
});