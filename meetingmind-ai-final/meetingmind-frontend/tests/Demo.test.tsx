import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Demo from "../client/src/pages/Demo";

describe("Demo Component", () => {
  it("renders the demo page with transcript", () => {
    render(<Demo />);
    expect(screen.getByText(/Raw Transcript/i)).toBeInTheDocument();
    expect(screen.getByText(/Process with MeetingMind/i)).toBeInTheDocument();
  });

  it("shows initial placeholder text for summary and actions", () => {
    render(<Demo />);
    expect(
      screen.getByText(/Click "Process" to see the AI summary/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Click "Process" to see extracted tasks/i)
    ).toBeInTheDocument();
  });

  it("processes transcript and displays summary and actions", async () => {
    render(<Demo />);
    const processButton = screen.getByText(/Process with MeetingMind/i);

    fireEvent.click(processButton);

    await waitFor(() => {
      expect(
        screen.getByText(/The team agreed on Q3 marketing budget allocation/i)
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Bob: Draft LinkedIn ad copy/i)
    ).toBeInTheDocument();
  });

  it("resets the demo state when Reset button is clicked", async () => {
    render(<Demo />);
    const processButton = screen.getByText(/Process with MeetingMind/i);

    fireEvent.click(processButton);

    await waitFor(() => {
      expect(
        screen.getByText(/The team agreed on Q3 marketing budget allocation/i)
      ).toBeInTheDocument();
    });

    const resetButton = screen.getByText(/Reset/i);
    fireEvent.click(resetButton);

    expect(
      screen.getByText(/Click "Process" to see the AI summary/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Click "Process" to see extracted tasks/i)
    ).toBeInTheDocument();
  });

  it("answers questions with keyword matching", async () => {
    render(<Demo />);
    const processButton = screen.getByText(/Process with MeetingMind/i);

    fireEvent.click(processButton);

    await waitFor(() => {
      expect(
        screen.getByText(/The team agreed on Q3 marketing budget allocation/i)
      ).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(
      /What is the budget for LinkedIn/i
    );
    const askButton = screen.getByText(/Ask/i);

    fireEvent.change(input, {
      target: { value: "What is the budget for LinkedIn?" },
    });
    fireEvent.click(askButton);

    await waitFor(() => {
      expect(
        screen.getByText(/The budget allocated for LinkedIn ads is \$20k/i)
      ).toBeInTheDocument();
    });
  });

  it("handles Enter key press in question input", async () => {
    render(<Demo />);
    const processButton = screen.getByText(/Process with MeetingMind/i);

    fireEvent.click(processButton);

    await waitFor(() => {
      expect(
        screen.getByText(/The team agreed on Q3 marketing budget allocation/i)
      ).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(
      /What is the budget for LinkedIn/i
    );

    fireEvent.change(input, { target: { value: "deadline" } });
    fireEvent.keyPress(input, { key: "Enter", code: "Enter", charCode: 13 });

    await waitFor(() => {
      expect(
        screen.getByText(/Carol needs the event budget by August 10th/i)
      ).toBeInTheDocument();
    });
  });
});
