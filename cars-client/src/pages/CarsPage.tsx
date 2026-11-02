import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { getCars, deleteCar } from '../services/carService';

export default function CarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        async function loadCars() {
            try {
                const data = await getCars(controller.signal);
                setCars(data);
            } catch (err) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadCars();

        return () => controller.abort();
    }, []);

    async function handleDelete(id: string) {
        const confirmed = window.confirm(
            'Czy na pewno chcesz usunąć ten samochód?'
        );

        if (!confirmed) return;

        try {
            await deleteCar(id);
            setCars(previousCars =>
                previousCars.filter(car => car.id !== id)
            );
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
    }

    if (loading) {
        return <p>Ładowanie samochodów...</p>;
    }

    if (error) {
        return <p>Błąd: {error}</p>;
    }

    return (
        <div>
            <h1>Lista samochodów</h1>

            <Link to="/cars/new">
                <button>Dodaj samochód</button>
            </Link>

            {cars.length === 0 ? (
                <p>Brak samochodów.</p>
            ) : (
                <ul>
                    {cars.map(car => (
                        <li key={car.id}>
                            <strong>{car.brand} {car.model}</strong>
                            {' | '}
                            <Link to={`/cars/${car.id}`}>
                                Szczegóły
                            </Link>
                            {' | '}
                            <Link to={`/cars/${car.id}/edit`}>
                                Edytuj
                            </Link>
                            {' | '}
                            <button onClick={() => handleDelete(car.id)}>
                                Usuń
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
