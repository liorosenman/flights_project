from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),  # Replace with the actual previous migration file
    ]

    operations = [
        migrations.RunSQL(
            """
            CREATE TABLE base_ticket (
                id BIGSERIAL PRIMARY KEY,
                flight_id BIGINT UNIQUE NOT NULL REFERENCES base_flight(id) ON DELETE CASCADE,
                customer_id BIGINT UNIQUE NOT NULL REFERENCES base_customer(id) ON DELETE CASCADE,
                is_active BOOLEAN DEFAULT TRUE NOT NULL
            );
            """,
            reverse_sql="DROP TABLE IF EXISTS base_ticket;",
        ),
    ]
