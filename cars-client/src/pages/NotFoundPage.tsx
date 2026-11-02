import { Link } from 'react-router';

export default function NotFoundPage() {
    return (
        <div>
            <h1>404</h1>
            <p>Nie znaleziono takiej strony.</p>
            <Link to="/">Wróć na stronę główną</Link>
        </div>
    );
}
