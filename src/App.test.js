import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the clinic home page and booking date cannot be before today', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /bienestar que empieza por tus pies/i })).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: /navegación principal/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/fecha preferida/i)).toHaveAttribute('min', getLocalDateString());
  expect(screen.getByLabelText(/teléfono/i)).toBeRequired();
});

test('sends an appointment request and displays the pending confirmation message', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({ message: 'Solicitud enviada correctamente.' }),
  });
  render(<App />);

  fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'María Pérez' } });
  fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'maria@example.com' } });
  fireEvent.change(screen.getByLabelText(/teléfono/i), { target: { value: '+56 9 1234 5678' } });
  fireEvent.change(screen.getByLabelText(/motivo de consulta/i), { target: { value: 'Evaluación podológica' } });
  fireEvent.change(screen.getByLabelText(/fecha preferida/i), { target: { value: getLocalDateString() } });
  fireEvent.change(screen.getByLabelText(/hora preferida/i), { target: { value: '10:00' } });
  fireEvent.submit(screen.getByRole('button', { name: /enviar solicitud/i }).closest('form'));

  expect(await screen.findByRole('status')).toHaveTextContent(/te contactará para confirmar tu hora/i);
  expect(fetchMock).toHaveBeenCalledWith('/api/appointments', expect.objectContaining({ method: 'POST' }));
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual(expect.objectContaining({ phone: '+56 9 1234 5678' }));
  await waitFor(() => expect(screen.getByLabelText(/nombre completo/i)).toHaveValue(''));
});
