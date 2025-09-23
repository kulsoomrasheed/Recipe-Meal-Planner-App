import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock next/navigation router
jest.mock('next/navigation', () => ({
	useRouter: () => ({ replace: jest.fn(), push: jest.fn(), prefetch: jest.fn() }),
}));

// Spy/mocks for API layer used by providers and page
import * as api from '../src/lib/api';

// Use real providers to satisfy hooks
import AppProviders from '../src/app/providers';
import AppPage from '../src/app/app/page';

describe('AppPage tabs', () => {
	const user = userEvent.setup();

	beforeEach(() => {
		jest.restoreAllMocks();
		// Ensure an authenticated session
		jest.spyOn(api, 'getStoredToken').mockImplementation(() => 'header.eyJ1c2VySUQiOiAiMTIzIiwgInVzZXJuYW1lIjogInRlc3QifQ.sig');
		jest.spyOn(api, 'parseJwt').mockImplementation(() => ({ userID: '123', username: 'test' }));
	});

	function renderApp() {
		render(
			<AppProviders>
				<AppPage />
			</AppProviders>
		);
	}

	test('My Recipes: shows recipe cards by default when recipes exist', async () => {
		jest.spyOn(api.RecipesAPI, 'list').mockResolvedValueOnce({ recipes: [
			{ id: 'r1', title: 'Pasta Primavera', ingredients: [{ name: 'pasta' }, { name: 'peas' }], steps: ['Boil', 'Mix'] },
		]});

		renderApp();

		// Default tab is My Recipes and should show recipe title
		expect(await screen.findByText('Pasta Primavera')).toBeInTheDocument();
		// And the Add Recipe button should be visible
		expect(screen.getByRole('button', { name: 'Add Recipe' })).toBeInTheDocument();
	});

	test('My Recipes: shows empty state when there are no recipes', async () => {
		jest.spyOn(api.RecipesAPI, 'list').mockResolvedValueOnce({ recipes: [] });

		renderApp();

		expect(await screen.findByText('No recipes yet. Create your first recipe!')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: '➕ Add a Recipe' })).toBeInTheDocument();
	});

	test('My Recipes: can open Add Recipe modal and submit', async () => {
		jest.spyOn(api.RecipesAPI, 'list').mockResolvedValueOnce({ recipes: [] });
		const createSpy = jest.spyOn(api.RecipesAPI, 'create').mockResolvedValueOnce({ ok: true });
		// Refetch after create
		jest.spyOn(api.RecipesAPI, 'list').mockResolvedValueOnce({ recipes: [] });

		renderApp();

		await screen.findByText('No recipes yet. Create your first recipe!');

		await user.click(screen.getByRole('button', { name: '➕ Add a Recipe' }));
		// Modal should open with title (heading)
		expect(await screen.findByRole('heading', { name: 'Add Recipe' })).toBeInTheDocument();

		// Labels are not associated; select textboxes by order: Title, Ingredients input, Steps textarea
		const textboxes = screen.getAllByRole('textbox');
		await user.type(textboxes[0], 'Tomato Soup');
		await user.type(textboxes[2], 'Blend{enter}Heat');

		await user.click(screen.getByRole('button', { name: 'Add' }));

		await waitFor(() => expect(createSpy).toHaveBeenCalledTimes(1));
		expect(createSpy).toHaveBeenCalledWith({
			title: 'Tomato Soup',
			description: 'Blend\nHeat'.slice(0, 120),
			ingredients: [],
			steps: ['Blend', 'Heat'],
		});
	});

	test('AI Suggestions: generates and displays AI output', async () => {
		jest.spyOn(api.RecipesAPI, 'list').mockResolvedValueOnce({ recipes: [] });
		const suggestSpy = jest.spyOn(api.AiAPI, 'suggest').mockResolvedValueOnce({ suggestions: 'Try making a fresh salad.' });

		renderApp();

		// Switch to AI Suggestions tab
		await user.click(screen.getByRole('button', { name: 'AI Suggestions' }));

		// Initially shows placeholder
		expect(screen.getByText('Your recipe will appear here.')).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Generate Recipe' }));

		await waitFor(() => expect(suggestSpy).toHaveBeenCalled());
		// Should render AI output heading and text
		expect(await screen.findByRole('heading', { name: 'AI Suggestions' })).toBeInTheDocument();
		expect(screen.getByText('Try making a fresh salad.')).toBeInTheDocument();
	});

	test('AI Meal Planner: generates and displays a plan', async () => {
		jest.spyOn(api.RecipesAPI, 'list').mockResolvedValueOnce({ recipes: [] });
		const mealPlanSpy = jest.spyOn(api.AiAPI, 'mealPlan').mockResolvedValueOnce({ mealPlan: 'Day 1: Oatmeal\nDay 2: Salad' });

		renderApp();

		await user.click(screen.getByRole('button', { name: 'AI Meal Planner' }));

		await user.click(screen.getByRole('button', { name: 'Generate Plan' }));

		await waitFor(() => expect(mealPlanSpy).toHaveBeenCalled());

		// The plan is rendered as <pre> joined by newlines
		expect(await screen.findByText(/Day 1: Oatmeal/)).toBeInTheDocument();
		expect(screen.getByText(/Day 2: Salad/)).toBeInTheDocument();
	});
});
