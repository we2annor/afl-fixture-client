import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RoundFilter } from "./RoundFilter";

const rounds = [
  { number: 1, name: "Round 1" },
  { number: 2, name: "Round 2" },
];

describe("RoundFilter", () => {
  it("shows the 'All rounds' placeholder when nothing is selected", () => {
    render(<RoundFilter rounds={rounds} value={null} onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("All rounds");
  });

  it("shows the selected round's name when a value is set", () => {
    render(<RoundFilter rounds={rounds} value={2} onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Round 2");
  });

  it("calls onChange with the round number when a round is picked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<RoundFilter rounds={rounds} value={null} onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "Round 2" }));

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("calls onChange with null when 'All rounds' is picked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<RoundFilter rounds={rounds} value={2} onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "All rounds" }));

    expect(onChange).toHaveBeenCalledWith(null);
  });
});
