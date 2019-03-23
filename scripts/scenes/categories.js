import configManager from '../config';
import Base from './base';
import Words from '../words';

class Categories extends Base
{

    init()
    {
        this.config = configManager.getConfig();

        this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);

        //Configure the plugin
        this.game.kineticScrolling.configure({
            verticalScroll: true,
            verticalWheel: true,
            deltaWheel: 90,
        });

        this.optionsDialog = null;
        this.selectedCategory = null;
    }


    create()
    {
        super.create();
        this.createCategories();
        this.createKineticScroll();
        this.createGradientMask(0, 180, '#FFFFFF', 'rgba(255,255,255,0)');
        this.createGradientMask(0, this.game.height - 50, 'rgba(255,255,255,0)', '#FFFFFF', { x: 0, y: 1 });
        this.topScrollIndicator = this.createScrollIndicator(this.game.width / 2, 170);
        this.bottomScrollIndicator = this.createScrollIndicator(this.game.width / 2, this.game.height - 40, { x: 1, y: -1 });
        this.createOptionsDialog();
        this.createtitle();
    }

    createOptionsDialog()
    {
        const optionsDialog = this.game.add.group();
        const background = this.createDialogBackground();

        const categoryTitle = this.game.add.text(this.game.width / 2, 0, "People", { font: `50px ${ this.config.fonts.primary }` });
        categoryTitle.fill = "#000000";
        categoryTitle.name = "title";
        categoryTitle.anchor.setTo(0.5, 0.5);
        categoryTitle.y = 200;

        const studyButton = this.game.add.text(this.game.width / 2, 0, "Study", { font: `65px ${ this.config.fonts.primary }` });
        studyButton.fill = "#000000";
        studyButton.anchor.setTo(0.5, 0.5);
        studyButton.y = 500;
        studyButton.inputEnabled = true;
        studyButton.events.onInputOver.add(() => { studyButton.fill = this.config.colours.primary });
        studyButton.events.onInputOut.add(() => { studyButton.fill = '#000000' });
        studyButton.events.onInputDown.add(() => { studyButton.fill = this.config.colours.primary });
        studyButton.events.onInputUp.add(() =>
        {
            this.playClickAudio()
            studyButton.fill = '#000000';
            this.game.state.start("Main", true, false, { category: this.selectedCategory, mode: "study" });
        })


        const startQuiz = this.game.add.text(this.game.width / 2, 0, "Begin Quiz", { font: `65px ${ this.config.fonts.primary }` });
        startQuiz.fill = "#000000";
        startQuiz.anchor.setTo(0.5, 0.5);
        startQuiz.y = 650;
        startQuiz.inputEnabled = true;
        startQuiz.events.onInputOver.add(() => { startQuiz.fill = this.config.colours.primary });
        startQuiz.events.onInputOut.add(() => { startQuiz.fill = '#000000' });
        startQuiz.events.onInputDown.add(() => { startQuiz.fill = this.config.colours.primary });
        startQuiz.events.onInputUp.add(() =>
        {
            this.playClickAudio()
            startQuiz.fill = '#000000';
            this.game.state.start("Main", true, false, { category: this.selectedCategory, mode: "test" });
        })


        optionsDialog.add(background);
        optionsDialog.add(categoryTitle);
        optionsDialog.add(studyButton);
        optionsDialog.add(startQuiz);
        optionsDialog.visible = false;
        optionsDialog.fixedToCamera = true;

        this.optionsDialog = optionsDialog;

    }

    showOptionsDialog()
    {
        this.optionsDialog.getByName('title').text = this.selectedCategory.name;
        this.optionsDialog.visible = true;
    }

    createGradientMask(x, y, topColour, bottomColour, anchor = { x: 0, y: 0 })
    {
        var myBmp = this.game.add.bitmapData(this.game.width, 50);
        var myGrd = myBmp.context.createLinearGradient(0, 0, 0, myBmp.height);
        myGrd.addColorStop(0, topColour);
        myGrd.addColorStop(1, bottomColour);
        myBmp.context.fillStyle = myGrd;
        myBmp.context.fillRect(0, 0, myBmp.width, myBmp.height);

        var gradient = this.game.add.sprite(x, y, myBmp);
        gradient.fixedToCamera = true;
        gradient.anchor.setTo(anchor.x, anchor.y);
    }

    createKineticScroll()
    {
        this.game.kineticScrolling.start();
    }

    update()
    {
        super.update();

        this.topScrollIndicator.visible = false;
        this.bottomScrollIndicator.visible = false;

        if (this.game.camera.y > 0)
        {
            this.topScrollIndicator.visible = true;
        }

        if (this.game.world.height > this.game.height)
        {
            this.bottomScrollIndicator.visible = true;
        }

        if (this.game.camera.y >= (this.game.world.height - this.game.height - 60))
        {
            this.bottomScrollIndicator.visible = false;
        }
    }

    createtitle()
    {
        const game = this.game;
        const centerX = game.world.centerX;

        // Title 
        const gameTitle = game.add.text(centerX, 50, "Quiz", { font: `40px ${ this.config.fonts.primary }` });
        gameTitle.anchor.setTo(0.5, 0.5);
        gameTitle.fixedToCamera = true;

        const categoryTitle = game.add.text(centerX, 120, "Categories", { font: `50px ${ this.config.fonts.primary }` });
        categoryTitle.fill = "#3BA185";
        categoryTitle.anchor.setTo(0.5, 0.5);
        categoryTitle.fixedToCamera = true;
    }

    createCategories()
    {
        // Categories Group
        const categoriesGroup = this.game.add.group();
        categoriesGroup.x = 20;
        categoriesGroup.y = 205;

        //	A mask is a Graphics object
        const mask = this.game.add.graphics(0, 0);
        mask.beginFill(0xffffff, 0.5);
        mask.drawRect(0, 180, this.game.width, this.game.height - 180 - 50);
        mask.fixedToCamera = true;

        // Apply mask to categories (for scroll overflow)
        categoriesGroup.mask = mask;

        // Get Category Names
        const categoryNames = Object.keys(Words.groups);

        for (let i = 0; i < categoryNames.length; i++)
        {
            // Category Name
            const categoryName = categoryNames[i];

            // Create Category Name 
            const categoryText = this.game.add.text(0, i * 80, (i + 1) + ") " + categoryName, { font: `40px ${ this.config.fonts.primary }`, align: "center" });
            categoryText.inputEnabled = true;

            // Add kinetic click events
            this.game.kineticScrolling.addClickEvents(categoryText, {
                down: () => { categoryText.fill = "#3BA185"; },
                up: () => { categoryText.fill = "#000000"; this.chooseCategory({ name: categoryName }) },
            });

            // Use cursor hand
            categoryText.input.useHandCursor = true;
            categoriesGroup.add(categoryText);
        }
        
        // Set scroll bounds
        this.game.world.setBounds(0, 0, this.game.width, (80 * categoryNames.length) + 250);
    }

    createScrollIndicator(x, y, scale = { x: 1, y: 1 })
    {
        const sizeScale = 0.5;

        var scrollIndicator = this.add.image(x, y, "triangle");
        scrollIndicator.fixedToCamera = true;
        scrollIndicator.anchor.setTo(0.5, 0.5);
        scrollIndicator.scale.setTo(scale.x * sizeScale, scale.y * sizeScale)
        scrollIndicator.visible = false;

        return scrollIndicator;
    }

    chooseCategory(category)
    {
        this.playClickAudio();
        this.selectedCategory = category;
        this.showOptionsDialog();
    }

    shutdown()
    {
        this.game.kineticScrolling.stop();
    }
}

export default Categories;