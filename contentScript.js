
jQuery(function() {
    var jsonButton = $("<a href='#' class='button-alt'><span class='label'>Copy as JSON</span></a>");


    jsonButton.on('click', function() {
        var creature = {};

        // Locate stat blocks
        hpBlock = $("span.mon-stat-block__attribute-label:contains('Hit Points')").parent();
        acBlock = $("span.mon-stat-block__attribute-label:contains('Armor Class')").parent();
        speedBlock = $("span.mon-stat-block__attribute-label:contains('Speed')").parent();
        damageVulnerabilitiesBlock = $("span.mon-stat-block__tidbit-label:contains('Damage Vulnerabilities')").parent();
        damageResistancesBlock = $("span.mon-stat-block__tidbit-label:contains('Damage Resistances')").parent();
        damageImmunitiesBlock = $("span.mon-stat-block__tidbit-label:contains('Damage Immunities')").parent();
        conditionImmunitiesBlock = $("span.mon-stat-block__tidbit-label:contains('Condition Immunities')").parent();
        savesBlock = $("span.mon-stat-block__tidbit-label:contains('Saving Throws')").parent();
        skillsBlock = $("span.mon-stat-block__tidbit-label:contains('Skills')").parent();
        sensesBlock = $("span.mon-stat-block__tidbit-label:contains('Senses')").parent();
        languagesBlock = $("span.mon-stat-block__tidbit-label:contains('Languages')").parent();
        challengeBlock = $("span.mon-stat-block__tidbit-label:contains('Challenge')").parent();
        descriptionBlock = $("div.mon-stat-block__description-block-content").first(); // no heading for the traits block...
        actionsBlock = $("div.mon-stat-block__description-block-heading:contains('Actions')").parent();
        reactionsBlock = $("div.mon-stat-block__description-block-heading:contains('Reactions')").parent();
        legendaryActionsBlock = $("div.mon-stat-block__description-block-heading:contains('Legendary Actions')").parent();


        // Populate creature fields
        creature.Source = window.location.href;
        creature.Type = $("div.mon-stat-block__meta").text().trim();
        creature.HP = {
            Value: hpBlock.find("span.mon-stat-block__attribute-data-value").text().trim(),
            Notes: hpBlock.find("span.mon-stat-block__attribute-data-extra").text().trim()
        };
        creature.AC = {
            Value: acBlock.find("span.mon-stat-block__attribute-data-value").text().trim(),
            Notes: acBlock.find("span.mon-stat-block__attribute-data-extra").text().trim()
        };
        creature.Speed = [
            speedBlock.find("span.mon-stat-block__attribute-data-value").text().trim(),
            speedBlock.find("span.mon-stat-block__attribute-data-extra").text().trim()
        ];
        creature.Abilities = {
            Str: $("div.ability-block__stat--str").find('span.ability-block__score').text().trim(),
            Dex: $("div.ability-block__stat--dex").find('span.ability-block__score').text().trim(),
            Con: $("div.ability-block__stat--con").find('span.ability-block__score').text().trim(),
            Int: $("div.ability-block__stat--int").find('span.ability-block__score').text().trim(),
            Wis: $("div.ability-block__stat--wis").find('span.ability-block__score').text().trim(),
            Cha: $("div.ability-block__stat--cha").find('span.ability-block__score').text().trim()
        };
        creature.DamageVulnerabilities = damageVulnerabilitiesBlock.find("span.mon-stat-block__tidbit-data").text().trim().split(',').map(Function.prototype.call, String.prototype.trim);
        creature.DamageResistances = damageResistancesBlock.find("span.mon-stat-block__tidbit-data").text().trim().split(',').map(Function.prototype.call, String.prototype.trim);
        creature.DamageImmunities = damageImmunitiesBlock.find("span.mon-stat-block__tidbit-data").text().trim().split(',').map(Function.prototype.call, String.prototype.trim);
        creature.ConditionImmunities = conditionImmunitiesBlock.find("span.mon-stat-block__tidbit-data").text().trim().split(',').map(Function.prototype.call, String.prototype.trim);


        creature.Saves = [];
        var saves = savesBlock.find("span.mon-stat-block__tidbit-data").text().trim().split(',').map(Function.prototype.call, String.prototype.trim);
        for (i=0;i<saves.length;i++) {
            var save = saves[i].split(" ");
            creature.Saves.push({
                Name: save[0],
                Modifier: save[1]
            });
        }

        creature.Skills = [];
        var skills = skillsBlock.find("span.mon-stat-block__tidbit-data").text().trim().split(',').map(Function.prototype.call, String.prototype.trim);
        for (i=0;i<skills.length;i++) {
            var skill = skills[i].split(" ");
            creature.Skills.push({
                Name: skill[0],
                Modifier: skill[1]
            });
        }


        creature.Senses = sensesBlock.find("span.mon-stat-block__tidbit-data").text().trim().split(',').map(Function.prototype.call, String.prototype.trim);;
        creature.Languages = languagesBlock.find("span.mon-stat-block__tidbit-data").text().trim().split(',').map(Function.prototype.call, String.prototype.trim);;
        creature.Challenge = challengeBlock.find("span.mon-stat-block__tidbit-data").text().trim();
        creature.Traits = [];
        $(descriptionBlock).children('p').each(function() {
            var x = $(this).clone();
            var name = $(x).find('strong').first().text();
            $(x).find('strong').first().remove();

            creature.Traits.push({
                Name: name,
                Content: $(x).text().trim()
            });

        });
        creature.Actions = [];
        $(actionsBlock).children('div.mon-stat-block__description-block-content').children('p').each(function() {
            var x = $(this).clone();
            var name = $(x).find('strong').first().text();
            $(x).find('strong').first().remove();

            creature.Actions.push({
                Name: name,
                Content: $(x).text().trim()
            });
        });
        creature.Reactions = [];
        $(reactionsBlock).children('div.mon-stat-block__description-block-content').children('p').each(function() {
            var x = $(this).clone();
            var name = $(x).find('strong').first().text();
            $(x).find('strong').first().remove();

            creature.Reactions.push({
                Name: name,
                Content: $(x).text().trim()
            });
        });
        creature.LegendaryActions = [];
        $(legendaryActionsBlock).children('div.mon-stat-block__description-block-content').children('div').each(function() {
            var x = $(this).clone();
            var name = $(x).find('strong').first().text();
            $(x).find('strong').first().remove();

            creature.LegendaryActions.push({
                Name: name,
                Content: $(x).text().trim()
            });
        });
        creature.Description = $('div.more-info-content').text();
        creature.ImageURL = $('img.monster-image').attr('src');

        var jsonOutput = JSON.stringify(creature, null, 2);
        console.log(jsonOutput);

        // Below is from https://techoverflow.net/2018/03/30/copying-strings-to-the-clipboard-using-pure-javascript/
        // Create new element
          var el = document.createElement('textarea');
          // Set value (string to be copied)
          el.value = jsonOutput;
          // Set non-editable to avoid focus and move outside of view
          el.setAttribute('readonly', '');
          el.style = {position: 'absolute', left: '-9999px'};
          document.body.appendChild(el);
          // Select text inside element
          el.select();
          // Copy text to clipboard
          document.execCommand('copy');
          // Remove temporary element
          document.body.removeChild(el);

          var original = $(jsonButton).text();
          $(jsonButton).children('span').text('Copied!');
          setTimeout(function(){ $(jsonButton).children('span').text(original); }, 1000);

    });

    $("div.more-links__links").prepend(jsonButton);
});
