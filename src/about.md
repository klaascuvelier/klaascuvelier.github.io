---
layout: layouts/default.njk
---
Placeholder for some more info about me, my work and my interests.
## Social Platforms
<ul class="mx-0 mb-20">
{% if socials.socials %}
    {% for social in socials.socials %}
        <li class="mb-1">
            {% if social.url %}
                <a href="{{ social.url }}" target="_blank" rel="noopener">{{ social.label }}</a></li>
            {% else %}
                {{ social.label }}
            {% endif %}
    {% endfor %}
{% endif %}
</ul>