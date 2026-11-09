import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { Car } from '../models/Car';
import { getCarById } from '../services/carService';
import axios from 'axios';
import {
    useCarUiStore,
} from '../store/useCarUiStore';

export default function CarDetailsPage() {
    const { id } = useParams();
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const favoriteCarIds =
        useCarUiStore(
            (state) =>
                state.favoriteCarIds,
        );

    const toggleFavorite =
        useCarUiStore(
            (state) =>
                state.toggleFavorite,
        );

    useEffect(() => {
        const controller = new AbortController();

        async function loadCar() {
            try {
                if (!id) throw new Error('Brak identyfikatora samochodu');

                const data = await getCarById(id, controller.signal);
                setCar(data);
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

        loadCar();

        return () => controller.abort();
    }, [id]);

    if (loading) return <p>Ładowanie...</p>;
    if (error) return <p>Błąd: {error}</p>;
    if (!car) return <p>Nie znaleziono samochodu.</p>;

    const isFavorite =
        favoriteCarIds.includes(
            car.id,
        );

    return (
        <div>
            <h1>{car.brand} {car.model}</h1>
            
            <button
                type="button"
                className={
                    isFavorite
                        ? 'favorite-button active-favorite'
                        : 'favorite-button'
                }
                onClick={() =>
                    toggleFavorite(car.id)
                }
            >
                {isFavorite
                    ? 'Ulubiony'
                    : 'Ulubione'}
            </button>

            <p>Liczba drzwi: {car.doorsNumber}</p>
            <p>Pojemność bagażnika: {car.luggageCapacity} l</p>
            <p>Pojemność silnika: {car.engineCapacity} cm³</p>
            <p>Rodzaj paliwa: {car.fuelType}</p>
            <p>Data produkcji: {car.productionDate}</p>
            <p>Średnie spalanie: {car.averageFuelConsumption} l/100 km</p>
            <p>Typ nadwozia: {car.bodyType}</p>

            <Link to={`/cars/${car.id}/edit`}>Edytuj</Link>
            <br />
            <Link to="/cars">Powrót do listy</Link>
        </div>
    );
}