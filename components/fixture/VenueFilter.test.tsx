import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VenueFilter } from "./VenueFilter";

const venues = [
  { id: 100, name: "MCG" },
  { id: 200, name: "Marvel Stadium" },
];

describe("VenueFilter", () => {
  it("shows the 'All venues' placeholder when nothing is selected", () => {
    render(<VenueFilter venues={venues} value={null} onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("All venues");
  });

  it("shows the selected venue's name when a value is set", () => {
    render(<VenueFilter venues={venues} value={100} onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("MCG");
  });

  it("calls onChange with the venue id when a venue is picked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<VenueFilter venues={venues} value={null} onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "MCG" }));

    expect(onChange).toHaveBeenCalledWith(100);
  });

  it("calls onChange with null when 'All venues' is picked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<VenueFilter venues={venues} value={100} onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "All venues" }));

    expect(onChange).toHaveBeenCalledWith(null);
  });
});
