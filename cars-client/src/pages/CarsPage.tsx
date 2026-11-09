
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import type { Car } from '../models/Car';
import { getCars, deleteCar } from '../services/carService';
import axios from 'axios';
import {
    useCarUiStore,
} from '../store/useCarUiStore';

export default function CarsPage() {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const favoriteCarIds =
        useCarUiStore(
            (state) => state.favoriteCarIds,
        );

    const toggleFavorite =
        useCarUiStore(
            (state) => state.toggleFavorite,
        );

    const removeFavorite =
        useCarUiStore(
            (state) =>
                state.removeFavorite,
        );

    const searchTerm =
        useCarUiStore(
            (state) =>
                state.searchTerm,
        );

    const setSearchTerm =
        useCarUiStore(
            (state) =>
                state.setSearchTerm,
        );

    const showFavoritesOnly =
        useCarUiStore(
            (state) =>
                state.showFavoritesOnly,
        );

    const setShowFavoritesOnly =
        useCarUiStore(
            (state) =>
                state.setShowFavoritesOnly,
        );

    useEffect(() => {
        const controller = new AbortController();

        async function loadCars() {
            try {
                const data = await getCars(controller.signal);
                setCars(data);
            } catch (caughtError) {
                if (axios.isCancel(caughtError)) {
                    return;
                }

                if (caughtError instanceof Error) {
                    setError(caughtError.message);
                } else {
                    setError('Wystapil nieznany blad.');
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

    const normalizedSearch =
        searchTerm
            .trim()
            .toLowerCase();

    const visibleCars =
        cars.filter((car) => {
            const matchesSearch =
                car.brand
                    .toLowerCase()
                    .includes(normalizedSearch)
                ||
                car.model
                    .toLowerCase()
                    .includes(normalizedSearch);

            const matchesFavorite =
                !showFavoritesOnly
                ||
                favoriteCarIds.includes(
                    car.id,
                );

            return (
                matchesSearch
                &&
                matchesFavorite
            );
        });

    async function handleDelete(id: string) {
        const confirmed = window.confirm(
            'Czy na pewno chcesz usunąć ten samochód?'
        );

        if (!confirmed) return;

        try {
            await deleteCar(id);
            removeFavorite(id);
            setCars(
                (currentCars) =>
                    currentCars.filter(
                        (car) =>
                            car.id !== id,
                    ),
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

            <div className="cars-toolbar">
                <input
                    type="search"
                    placeholder="Szukaj po marce lub modelu..."
                    value={searchTerm}
                    onChange={(event) =>
                        setSearchTerm(
                            event.target.value,
                        )
                    }
                />

                <label className="favorite-filter">
                    <input
                        type="checkbox"
                        checked={showFavoritesOnly}
                        onChange={(event) =>
                            setShowFavoritesOnly(
                                event.target.checked,
                            )
                        }
                    />
                    Tylko ulubione
                </label>
            </div>

            {visibleCars.length === 0 ? (
                <p>Nie znaleziono samochodów.</p>
            ) : (
                <ul>
                    {visibleCars.map(car => (
                        <li key={car.id}>
                            <strong>{car.brand} {car.model}</strong>

                            {' | '}
                            <button
                                type="button"
                                className={
                                    favoriteCarIds.includes(car.id)
                                        ? 'favorite-button active-favorite'
                                        : 'favorite-button'
                                }
                                onClick={() => toggleFavorite(car.id)}
                            >
                                {favoriteCarIds.includes(car.id)
                                    ? 'Ulubiony'
                                    : 'Ulubione'}
                            </button>
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
