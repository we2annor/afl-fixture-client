import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders nothing when there is only one page", () => {
    const { container } = render(
      <Pagination page={1} pageCount={1} onChange={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the current page and total page count", () => {
    render(<Pagination page={2} pageCount={5} onChange={vi.fn()} />);
    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
  });

  it("disables Previous on the first page", () => {
    render(<Pagination page={1} pageCount={5} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
  });

  it("disables Next on the last page", () => {
    render(<Pagination page={5} pageCount={5} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous" })).toBeEnabled();
  });

  it("calls onChange with page - 1 when Previous is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination page={3} pageCount={5} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Previous" }));

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("calls onChange with page + 1 when Next is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Pagination page={3} pageCount={5} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(onChange).toHaveBeenCalledWith(4);
  });
});
