import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TeamFilter } from "./TeamFilter";

const teams = [
  { id: 10, name: "Richmond" },
  { id: 20, name: "Carlton" },
];

describe("TeamFilter", () => {
  it("labels the select 'Filter by Teams'", () => {
    render(<TeamFilter teams={teams} value={null} onChange={vi.fn()} />);
    expect(screen.getByLabelText("Filter by Teams")).toBe(
      screen.getByRole("combobox")
    );
  });

  it("shows the 'All Teams' placeholder when nothing is selected", () => {
    render(<TeamFilter teams={teams} value={null} onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("All Teams");
  });

  it("shows the selected team's name when a value is set", () => {
    render(<TeamFilter teams={teams} value={20} onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Carlton");
  });

  it("calls onChange with the team id when a team is picked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TeamFilter teams={teams} value={null} onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Carlton" }));

    expect(onChange).toHaveBeenCalledWith(20);
  });

  it("calls onChange with null when 'All Teams' is picked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TeamFilter teams={teams} value={20} onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "All Teams" }));

    expect(onChange).toHaveBeenCalledWith(null);
  });
});
