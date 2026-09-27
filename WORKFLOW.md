# AI Development Workflow Comparison

## Overview

This task compared two AI-assisted development workflows by building the same settings form twice. The first version used a single vague prompt, while the second version used a detailed specification, project file references, constraints, expected behavior, accessibility requirements, and verification instructions.

## Round 1: Vague Prompt

The first implementation was created using a short prompt asking the AI to build a user-friendly settings form with validation. The AI had to decide the form structure, fields, validation behavior, styling, and implementation details itself.

The result was functional, but several implementation decisions were made by the AI without explicit project requirements. This meant more manual review was needed to determine whether the implementation matched the intended behavior and accessibility expectations.

## Round 2: Precise Prompt

The second implementation started with inspection and a short implementation plan. The prompt specified the required fields, validation rules, success behavior, accessibility requirements, styling constraints, and files to use. It also explicitly required tests for validation and successful submission, followed by test and production build verification.

This workflow made the expected behavior much clearer and reduced ambiguity during implementation.

## Correctness and Edge Cases

The precise workflow explicitly covered required fields, invalid email input, valid submission, and success feedback. These requirements were also included in the verification process. This made it easier to check correctness and identify missing behavior.

## Accessibility

The precise prompt explicitly required semantic form elements, associated labels, understandable error messages, and keyboard accessibility. These requirements gave the AI clear accessibility targets instead of leaving them to assumptions.

## Review Effort

The vague approach was faster to start but required more review because important requirements were unspecified. The precise approach required more planning and prompt writing initially, but the explicit requirements and automated verification made the final review more structured.

## Conclusion

The comparison shows that effective AI-assisted development depends on how the AI is directed. A vague prompt can produce a working feature, but a precise workflow provides clearer requirements, better verification, and a more repeatable development process.