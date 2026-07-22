from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("lessons", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="lessonblocktranslation",
            name="content",
            field=models.JSONField(blank=True, default=dict),
        ),
    ]
