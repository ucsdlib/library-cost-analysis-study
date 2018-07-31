Array.prototype.contains = function(element) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == element) return true;
	}
	return false;
}

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,'');
}

// from http://www.ilfilosofo.com/blog/2008/04/14/addevent-preserving-this/
function addEvent(obj, type, fn) {
	if (obj.addEventListener) { // W3C standard
		obj.addEventListener(type, fn, false);
	}
	else if (obj.attachEvent) { // IE
		obj.attachEvent('on' + type, function() {return fn.call(obj, window.event);});
	}
}

function addClickEvent(elem, func, followLink) {
	// If the element has an onclick event handler already, capture it; otherwise create an empty anonymous function
	var oldonclick = (typeof elem.onclick == 'function') ? elem.onclick : function () {};
	// Set the element's onclick function to do the original function first, then the new one
	//alert("In addClickEvent(): " + elem);
	elem.onclick = function () {
		oldonclick(); // doesn't matter if original onclick had return true/false, though we could capture the result and override followLink if we wanted
		func(elem);
		return followLink;
	};
}

function getCookie(cookieName) {
	var cookies = document.cookie.split(';');
	for (var i = 0; i < cookies.length; i++) {
		var crumbs = cookies[i].split('=');
		if (crumbs[0].trim() == cookieName && cookies.length > 1) return unescape(crumbs[1].trim());
	}
	return null; // cookieName not found
}

function isSurveyTime() {
	// Build array of testing periods (start and stop); there should be twelve pairs, one per month for a year, but not all are known yet
	// mmm dd yyyy hh24:00 PST or PDT
	// PDT 2018: Ends November 4 2 am; PST until March 10 2019, when PDT starts again
	var testTimes = [
		[Date.parse("Jul 31 2018 11:00 PDT"), Date.parse("Jul 31 2018 13:00 PDT")]
	,	[Date.parse("Aug 20 2018 17:00 PDT"), Date.parse("Aug 20 2018 19:00 PDT")]
	,	[Date.parse("Sep 19 2018 09:00 PDT"), Date.parse("Sep 19 2018 11:00 PDT")]
	];

	// Add current test window for specific hosts, for testing
	var host = window.location.host;
	switch (host) {
		case 'cattest.library.ucla.edu':
		case 'digidev.library.ucla.edu':
		case 'frontera.dev.gobsp.com':
		case 'idep.dev.gobsp.com':
		case 'laadp.dev.gobsp.com':
		case 'ucla.preview.summon.serialssolutions.com':
		case 'www-test.library.ucla.edu':
			testTimes.push([Date.parse("Jul 20 2018 00:00 PDT"), Date.parse("Jul 31 2018 11:00 PDT")]);
			break;
		// no default
	}

	var now = new Date().getTime();
	for (var testTime in testTimes) {
		var start = testTimes[testTime][0];
		var stop = testTimes[testTime][1];
		if ( (start <= now) && (now < stop) ) return true;
	}
	return false;
}

function isDomainSurveyable(link) {
	// Returns true if entire domain is eligible for survey, instead of just specific pages
	if (link == null) var link = window.location;
	var domain = link.hostname;
	// Do comparison without initial www, if present
	domain = domain.replace(/^www[.]/, '');
	var surveyable = false;
	// List of domains from https://proxy.ucla.edu/raw-proxy-list.txt, in alpha order, with other domains added at top of list
	var surveyableDomains = [
		'uclibs.org'
	,	'digidev.library.ucla.edu'
	,	'frontera.dev.gobsp.com'
	,	'idep.dev.gobsp.com'
	,	'laadp.dev.gobsp.com'
	,	'129.35.213.31'
	,	'129.35.248.48'
	,	'170.225.184.107'
	,	'170.225.96.21'
	,	'170.225.99.9'
	,	'20thdb.jp'
	,	'2facts.com'
	,	'360.datamonitor.com'
	,	'aacr.org'
	,	'aacrjournals.org'
	,	'aafp.org'
	,	'aanda.org'
	,	'aaojournal.org'
	,	'aap.org'
	,	'aapgbulletin.datapages.com'
	,	'aappublications.org'
	,	'aau.org'
	,	'abc-clio.com'
	,	'abimperio.net'
	,	'abmsdirectory.com'
	,	'academic.oup.com'
	,	'academicmedicine.org'
	,	'academicrightspress.com'
	,	'access.rdatoolkit.org'
	,	'accessem.com'
	,	'accessengineeringlibrary.com'
	,	'accessible.com'
	,	'accessmedicine.com'
	,	'accesspharmacy.com'
	,	'accessscience.com'
	,	'accesssurgery.com'
	,	'accuweather.ap.org'
	,	'acm.org'
	,	'acpjc.org'
	,	'acponline.org'
	,	'acs.org'
	,	'ada.org'
	,	'aeaweb.org'
	,	'aebnet.nl'
	,	'aemj.org'
	,	'afb.org'
	,	'africa-confidential.com'
	,	'africanstudiescompanion.com'
	,	'ag.arizona.edu'
	,	'agriculturenetbase.com'
	,	'agu.org'
	,	'ahajournals.org'
	,	'aiaa.org'
	,	'aidsinfo.nih.gov'
	,	'aidsonline.com'
	,	'aip.org'
	,	'airiti.com'
	,	'ajcn.org'
	,	'ajcp.ascpjournals.org'
	,	'ajkd.org'
	,	'ajnr.org'
	,	'ajph.org'
	,	'ajronline.org'
	,	'akkrt.hu'
	,	'alcoholism-cer.com'
	,	'alexanderstreet.com'
	,	'alexanderstreet2.com'
	,	'alexanderstreet4.com'
	,	'alexanderstreet6.com'
	,	'allafrica.com'
	,	'allenpress.com'
	,	'alpha.med.ege.edu.tr'
	,	'alphamedpress.org'
	,	'alternative-therapies.com'
	,	'aluka.org'
	,	'alzheimerjournal.com'
	,	'ama-assn.org'
	,	'amamanualofstyle.com'
	,	'amdigital.co.uk'
	,	'amfar.org'
	,	'amjbot.org'
	,	'amjclinicaloncology.com'
	,	'amjforensicmedicine.com'
	,	'amjpathol.org'
	,	'ams.org'
	,	'anb.org'
	,	'ancestrylibrary.com'
	,	'ancientnarrative.com'
	,	'anesthesia-analgesia.org'
	,	'anesthesiology.org'
	,	'annallergy.org'
	,	'annals.math.princeton.edu'
	,	'annals.org'
	,	'annalsnyas.org'
	,	'annalsofsurgery.com'
	,	'annclinlabsci.org'
	,	'annee-philologique.com'
	,	'annrheumdis.com'
	,	'annualreviews.org'
	,	'anthrosource.net'
	,	'anti-cancerdrugs.com'
	,	'antimicrobe.org'
	,	'ap.accuweather.com'
	,	'apa.org'
	,	'apabi.com'
	,	'aphapublications.org'
	,	'apimages.ap.org'
	,	'apimages.com'
	,	'aps.org'
	,	'apt.rcpsych.org'
	,	'arabidopsis.org'
	,	'arba.odyssi.com'
	,	'arbor.revistas.csic.es'
	,	'archdischild.com'
	,	'archivaria.ca'
	,	'archive.chosun.com'
	,	'archive.thenation.com'
	,	'areditions.com'
	,	'arl.org'
	,	'artfl.uchicago.edu'
	,	'artfl-project.uchicago.edu'
	,	'artflx.uchicago.edu '
	,	'artstor.org'
	,	'ascelibrary.org'
	,	'ascopubs.org'
	,	'ashs.org'
	,	'asia-studies.com'
	,	'askzad.com'
	,	'asm.org'
	,	'asmedigitalcollection.asme.org'
	,	'aspetjournals.org'
	,	'astm.org'
	,	'atozdatabases.com'
	,	'atozmapsonline.com'
	,	'atsdr1.atsdr.cdc.gov'
	,	'atsjournals.org'
	,	'atypon-link.com'
	,	'avma.org'
	,	'barkov.uchicago.edu'
	,	'bccresearch.com'
	,	'bdsl-online.de'
	,	'bepress.com'
	,	'bergfashionlibrary.com'
	,	'berghahnbooksonline.com'
	,	'best-in-class.com'
	,	'bestpracticedatabase.com'
	,	'bestpracticedatabase.eapps.com'
	,	'biblio.ebiblioteka.ru'
	,	'biblioline.nisc.com'
	,	'bids.ac.uk'
	,	'bi-interactive.com'
	,	'biochemj.org'
	,	'biocyc.org'
	,	'biological-markers.com'
	,	'biologists.com'
	,	'biolreprod.org'
	,	'bioone.org'
	,	'biophysj.org'
	,	'biosciencenetbase.com'
	,	'bir.org.uk'
	,	'birdsna.org'
	,	'birjournals.org'
	,	'bizjournals.com'
	,	'bizminer.com'
	,	'bjophthalmol.com'
	,	'bjp.rcpsych.org'
	,	'blackwell-synergy.com'
	,	'blake.lib.rochester.edu'
	,	'bloodjournal.hematologylibrary.org'
	,	'bloodjournal.org'
	,	'bloomsburyfashioncentral.com'
	,	'bmj.com'
	,	'bmo.bmiresearch.com'
	,	'bna.birds.cornell.edu'
	,	'books.mcgraw-hill.com'
	,	'booksinprint.com'
	,	'brepolis.net'
	,	'brepols.net'
	,	'brepolsonline.net'
	,	'brill.com'
	,	'brillonline.com'
	,	'brillonline.nl'
	,	'britannica.com'
	,	'brjpharmacol.org'
	,	'bssaonline.org'
	,	'bublicadministrationnetbase.com'
	,	'buddhism-dict.net'
	,	'buildinggreen.com'
	,	'businessmonitor.com'
	,	'businessnetbase.com'
	,	'bvdinfo.com'
	,	'c.ggimg.com'
	,	'ca.rand.org'
	,	'cabdirect.org'
	,	'cairn.info'
	,	'calhealth.org'
	,	'caliber.ucpress.net'
	,	'calico.org'
	,	'callisto.ggimg.com'
	,	'cambridge.org'
	,	'cambridgesoft.com'
	,	'cancercell.org'
	,	'catalog.princeton.edu'
	,	'catchword.com'
	,	'cba.org'
	,	'cc.columbia.edu'
	,	'cch.com'
	,	'ceeol.com'
	,	'ceicdata.com'
	,	'ceicdata.securities.com'
	,	'cell.com'
	,	'cellpress.com'
	,	'chadwyck.com'
	,	'chant.org'
	,	'charlestonco.com'
	,	'checkpoint.riag.com'
	,	'chemeducator.org'
	,	'chemengonline.com'
	,	'chemind.org'
	,	'chemistryworld.com'
	,	'chemlibnetbase.com'
	,	'chemnetbase.com'
	,	'chestpubs.org'
	,	'chicagomanualofstyle.org'
	,	'chinabook.cnpereading.com'
	,	'chinadataonline.org'
	,	'choicereviews.org'
	,	'chosun.excavation.co.kr'
	,	'chronicle.com'
	,	'ci.nii.ac.jp'
	,	'ciaonet.org'
	,	'cios.org'
	,	'civilengineeringnetbase.com'
	,	'clarku.edu'
	,	'classificationweb.net'
	,	'classiques-garnier.com'
	,	'classweb.loc.gov'
	,	'cleantechnetbase.com'
	,	'clinchem.org'
	,	'clinexprheumatol.org'
	,	'cma.ca'
	,	'cmes.techscience.com'
	,	'cnbksy.cn'
	,	'cnbksy.com'
	,	'cnki.en.eastview.com '
	,	'cnki.net'
	,	'cnki.zh.eastview.com'
	,	'cochranelibrary.com'
	,	'cogbehavneurol.com'
	,	'cogbib.mouton-content.com'
	,	'cognet.mit.edu'
	,	'colet.lib.uchicago.edu'
	,	'colet.uchicago.edu'
	,	'collegesource.org'
	,	'columbiagazetteer.org'
	,	'companiontophonology.com'
	,	'comp-index.com'
	,	'computer.org'
	,	'computernetbase.com'
	,	'computingreviews.com'
	,	'concentric-literature.url.tw'
	,	'conference-board.org'
	,	'congressionaldigest.com'
	,	'conwaygreene.com'
	,	'cornell.mirror.aps.org'
	,	'cpa-apc.org'
	,	'cpadmin.riag.com'
	,	'cqpress.com'
	,	'crcjournals.com'
	,	'crcnetbase.com'
	,	'crcpress.com'
	,	'crl.edu'
	,	'csa.com'
	,	'csa1.co.uk'
	,	'csa1.com'
	,	'csa2.com'
	,	'csa3.com'
	,	'cshlp.org'
	,	'cshmonographs.org'
	,	'csiro.au'
	,	'dachengdata.com'
	,	'database.asahi.com'
	,	'datagold.com'
	,	'data-planet.com'
	,	'db.saur.de'
	,	'dbpia.co.kr'
	,	'ddrs.psmedia.com'
	,	'degruyter.com'
	,	'degruyter.de'
	,	'dekker.com'
	,	'delphion.com'
	,	'dentalbytes.com'
	,	'dentalsuccess.com'
	,	'desktop.loc.gov'
	,	'dev.biologists.org'
	,	'developmentalcell.com'
	,	'diabetesjournals.org'
	,	'dialogatsite.com'
	,	'dictionaryofeconomics.com'
	,	'digital.library.ucla.edu'
	,	'digitalcommons.library.arizona.edu'
	,	'digitalconcerthall.com'
	,	'digitallibrary.sae.org'
	,	'digizeitschriften.de'
	,	'dmd.org'
	,	'download.softwarecentral.ucla.edu'
	,	'dpf99.library.ucla.edu'
	,	'dram.nyu.edu'
	,	'dukejournals.org'
	,	'dukeupress.edu'
	,	'dx.doi.org'
	,	'dyabola.de'
	,	'earthscape.org'
	,	'eastview.com'
	,	'eblib.com'
	,	'ebmonline.org'
	,	'ebooks.abc-clio.com'
	,	'ebsco.com'
	,	'ebsco-content.com'
	,	'ebscohost.com'
	,	'ecoamericas.com'
	,	'economicsnetbase.com'
	,	'economist.com'
	,	'ecosal.org'
	,	'ecsdl.org'
	,	'edpsciences.org'
	,	'edreview.org'
	,	'edrs.com '
	,	'eena.alexanderstreet.com'
	,	'eenews.net'
	,	'e-enlightenment.com'
	,	'ehraf.hti.umich.edu'
	,	'ehrafarchaeology.yale.edu'
	,	'ehrafworldcultures.yale.edu'
	,	'ehu.es'
	,	'eiu.com'
	,	'ejb.org'
	,	'ejbiochem.org'
	,	'ejbjs.org'
	,	'eje.org'
	,	'ejournals.unm.edu'
	,	'elecjoncol.org'
	,	'electricalengineeringnetbase.com'
	,	'elementsmagazine.org'
	,	'elib.cs.berkeley.edu'
	,	'elis.sk'
	,	'els.net'
	,	'els-cdn.com'
	,	'elsevier.com'
	,	'elsevierhealth.com'
	,	'emarketer.com'
	,	'emboj.org'
	,	'embopress.org'
	,	'emeraldinsight.com'
	,	'emerald-library.com'
	,	'emis.com'
	,	'ems-ph.org'
	,	'ency-japan.com'
	,	'encykorea.com'
	,	'endocrinology-journals.org'
	,	'endojournals.org'
	,	'engineeringvillage.com'
	,	'engineeringvillage2.org'
	,	'engnetbase.com'
	,	'entertainment.timesonline.co.uk'
	,	'environetbase.com'
	,	'envplan.com'
	,	'epnet.com'
	,	'epub.org.br'
	,	'epubs.siam.org'
	,	'equinoxjournals.com'
	,	'eres.library.ucla.edu'
	,	'ereserves.library.ucla.edu'
	,	'ergonomicsnetbase.com'
	,	'ersjournals.com'
	,	'esajournals.org'
	,	'esapubs.org'
	,	'etext.library.ucla.edu'
	,	'ets.umdl.umich.edu'
	,	'etsupp.com'
	,	'euppublishing.com'
	,	'eureka.rlg.org'
	,	'euromonitor.com'
	,	'europaworld.com'
	,	'eutils.ncbi.nlm.nih.gov'
	,	'evolutionary-ecology.com'
	,	'ewjm.com'
	,	'exlibrisgroup.com'
	,	'extenza-eps.com'
	,	'f1000biology.com'
	,	'f1000medicine.com'
	,	'factiva.com'
	,	'familiesinsociety.org'
	,	'familiesinsocietyjournal.org'
	,	'fasebj.org'
	,	'faulkner.com'
	,	'fda.gov'
	,	'ffas.usda.gov'
	,	'firstsearch.oclc.org'
	,	'fold3.com'
	,	'foodnetbase.com'
	,	'footnote.com'
	,	'foreignaffairs.org'
	,	'forensicnetbase.com'
	,	'fourier.ujf-grenoble.fr'
	,	'freedoniagroup.com'
	,	'frontera-play.library.ucla.edu'
	,	'fundingopps.cos.com'
	,	'g.ggimg.com'
	,	'gab.cookie.oup.com'
	,	'galegroup.com'
	,	'galenet.com'
	,	'galenet.gale.com'
	,	'gateway.nlm.nih.gov'
	,	'gbv.de'
	,	'geneletter.org'
	,	'genengnews.com'
	,	'genesdev.org'
	,	'genetics.org'
	,	'genome.org'
	,	'genomemedicine.com'
	,	'geographicresearch.com'
	,	'geoscienceworld.org'
	,	'gerontologyjournals.org'
	,	'gide.uchicago.edu'
	,	'gideononline.com'
	,	'gleeditions.com'
	,	'global.factiva.com'
	,	'globalbooksinprint.com'
	,	'global-dental.com'
	,	'globalfinancialdata.com'
	,	'globalfindata.com'
	,	'goldstandard.com'
	,	'grants.nih.gov'
	,	'greenwood.com'
	,	'greenwood.scbbs.com'
	,	'grolier.com'
	,	'groveart.com'
	,	'grovemusic.com'
	,	'groveopera.com'
	,	'gsajournals.org'
	,	'gsapubs.org'
	,	'gso.gbv.de'
	,	'guidetoreference.org'
	,	'guilfordjournals.com'
	,	'gutenberg-e.org'
	,	'gutjnl.com'
	,	'gwdg.de'
	,	'haaretz.com'
	,	'hadashot-esi.org.il'
	,	'haematologica.it'
	,	'haifa.ac.il'
	,	'hanszell.co.uk'
	,	'hapi.gseis.ucla.edu'
	,	'hapi.ucla.edu'
	,	'harpweek.com'
	,	'harrisonsonline.com'
	,	'hathitrust.org'
	,	'haworthpress.com'
	,	'hbcpnetbase.com'
	,	'hc-sc.gc.ca'
	,	'hdl.handle.net'
	,	'hdl.lib.umich.edu'
	,	'health.gov.au'
	,	'healthaffairs.org'
	,	'heartjnl.com'
	,	'heinonline.org'
	,	'hematologylibrary.org'
	,	'hepg.org'
	,	'hepgjournals.org'
	,	'hh.um.es'
	,	'highwire.org'
	,	'highwire.stanford.edu'
	,	'hipeac.net'
	,	'hiperkitap.com'
	,	'histories.cambridge.org'
	,	'historycooperative.org '
	,	'hkam.org.hk'
	,	'hood2.ei.org'
	,	'hoovers.com'
	,	'hospitalpracticemed.com'
	,	'hosppract.com'
	,	'hpq.press.illinois.edu'
	,	'hsph.harvard.edu'
	,	'hsus.cambridge.org'
	,	'hti.umich.edu'
	,	'huc.edu'
	,	'humanities.uchicago.edu'
	,	'humankinetics.com'
	,	'hw.oeaw.ac.at'
	,	'hwwilsonweb.com'
	,	'iaor-palgrave.com'
	,	'ibisworld.com'
	,	'icadb.princeton.edu'
	,	'icevirtuallibrary.com'
	,	'icpsr.umich.edu'
	,	'icsd.fiz-karlsruhe.de'
	,	'icsdweb.fiz-karlsruhe.de'
	,	'idc.nl'
	,	'idealibrary.com'
	,	'idoican.com.cn'
	,	'idpr.org.uk'
	,	'ieee.org'
	,	'ielimg.ihs.com'
	,	'igi-global.com'
	,	'igpublish.com'
	,	'ijs.sgmjournals.org'
	,	'imdatabases.library.utoronto.ca'
	,	'imfstatistics.org'
	,	'immunity.com'
	,	'immunology.org'
	,	'indiastat.com'
	,	'industrialnetbase.com'
	,	'infoed.org'
	,	'infopoems.com'
	,	'informa.com'
	,	'informahealthcare.com '
	,	'informaworld.com'
	,	'infosecuritynetbase.com'
	,	'infotrac.galegroup.com'
	,	'ingenta.com'
	,	'ingentaconnect.com'
	,	'inquiryjournal.org'
	,	'intarch.ac.uk'
	,	'intlpress.com'
	,	'int-res.com'
	,	'iop.org'
	,	'iopscience.iop.org'
	,	'iospress.com'
	,	'iovs.org'
	,	'ipap.jp'
	,	'ipasource.com'
	,	'ipm.academiccharts.com'
	,	'ippnw.org'
	,	'irishnewsarchive.com'
	,	'ishib.org'
	,	'isiknowledge.com'
	,	'isla.lmi.net'
	,	'issn.org'
	,	'itergateway.org'
	,	'itknowledgebase.net'
	,	'iucr.org'
	,	'iumj.indiana.edu'
	,	'iwaponline.com'
	,	'jamanetwork.com'
	,	'jamia.org'
	,	'jaoa.org'
	,	'japanknowledge.com'
	,	'jasmine.gdnet.ucla.edu'
	,	'jasn.org'
	,	'jbc.org'
	,	'jbiol.com'
	,	'jbmronline.org'
	,	'jcb.org'
	,	'jchemed.chem.wisc.edu'
	,	'jci.org'
	,	'jclinrheum.com'
	,	'jco-online.com'
	,	'jcs.biologists.org'
	,	'jdentaled.org'
	,	'jeb.biologists.org'
	,	'jem.org'
	,	'jem.rupress.org'
	,	'jendocrinolinvest.it'
	,	'jewishreviewofbooks.com'
	,	'jgp.org'
	,	'jhc.org'
	,	'jhep.mse.jhu.edu'
	,	'jhr.uwpress.org'
	,	'jidonline.org'
	,	'jiesonline.com'
	,	'jimmunol.org'
	,	'jjphysiol.jstage.jst.go.jp'
	,	'jleukbio.org'
	,	'jlr.org'
	,	'jneurochem.org'
	,	'jneurosci.org'
	,	'jnm.snmjournals.org'
	,	'jnnp.com'
	,	'jodi.ecs.soton.ac.uk'
	,	'joim.com'
	,	'joionline.org'
	,	'jopdentonline.org'
	,	'joponline.org'
	,	'jospt.org'
	,	'journal.co.nz'
	,	'journalofpediatricophthalmology.com'
	,	'journals.ametsoc.org'
	,	'journals.asha.org'
	,	'journals.cambridge.org'
	,	'journals.cms.math.ca'
	,	'journals.co.za'
	,	'journals.endocrinology.org'
	,	'journals.royalsociety.org'
	,	'journals.sfu.ca'
	,	'journals.uchicago.edu'
	,	'journalsleep.org'
	,	'journalsonline.tandf.co.uk'
	,	'jove.com'
	,	'jp.physoc.org'
	,	'jpet.org'
	,	'jpgn.org'
	,	'jrheum.org'
	,	'jsad.com'
	,	'jspinaldisorders.com'
	,	'jstor.org'
	,	'jtrauma.com'
	,	'jucs.org'
	,	'jultrasoundmed.org'
	,	'kanopy.com'
	,	'kanopystreaming.com'
	,	'karger.com'
	,	'keesings.com'
	,	'kiss.kstudy.com'
	,	'kluweronline.com'
	,	'knovel.com'
	,	'knowledgeexpress.com'
	,	'kompass.com'
	,	'kompass-usa.com'
	,	'koreaa2z.com'
	,	'krpia.co.kr'
	,	'kstudy.com'
	,	'kurtis.it'
	,	'ladb.unm.edu'
	,	'landesbioscience.com'
	,	'latinnews.com'
	,	'leaonline.com'
	,	'learnmem.org'
	,	'lexika.tanto.de'
	,	'lexis.com'
	,	'lexisnexis.com'
	,	'lexis-nexis.com'
	,	'lib.uchicago.edu'
	,	'lib.umich.edu'
	,	'librapharm.co.uk'
	,	'library.marketlineinfo.com'
	,	'library.seg.org'
	,	'library.uiuc.edu'
	,	'library.utoronto.ca'
	,	'library.yorku.ca'
	,	'libraryissues.com'
	,	'licensed.cdlib.org'
	,	'liebertonline.com'
	,	'liebertpub.com'
	,	'lis.uiuc.edu'
	,	'litguide.press.jhu.edu'
	,	'liverpooluniversitypress.co.uk'
	,	'locatorplus.gov'
	,	'locus.siam.org'
	,	'loebclassics.com'
	,	'lunaimaging.com'
	,	'lwwonline.com'
	,	'lyellcollection.org'
	,	'machaut.uchicago.edu'
	,	'magazineresearchcenter.com'
	,	'maneyonline.com'
	,	'mankindquarterly.com'
	,	'marketline.com'
	,	'marketresearch.com'
	,	'massey.ac.nz'
	,	'materialconnexion.com'
	,	'materialsnetbase.com'
	,	'mathjournals.org'
	,	'mathnetbase.com'
	,	'mcponline.org'
	,	'mdconsult.com'
	,	'mdx.com'
	,	'mechanicalengineeringnetbase.com'
	,	'medicalletter.org'
	,	'medici.tv'
	,	'medlet-best.securesites.com'
	,	'melvyl.cdlib.org'
	,	'mend.endojournals.org'
	,	'mergent.com'
	,	'mergenthorizon.com'
	,	'mergentkbr.com'
	,	'mergentonline.com'
	,	'metapress.com'
	,	'metopera.org'
	,	'mganet.org'
	,	'mhmedical.com'
	,	'mic.sgmjournals.org'
	,	'micromedex.com'
	,	'micromedexsolutions.com'
	,	'militarynetbase.com'
	,	'minsocam.org'
	,	'mitpressjournals.org'
	,	'mlajournals.org'
	,	'molbiolcell.org'
	,	'molbiolevol.org'
	,	'molecule.org'
	,	'molpharm.org'
	,	'morganclaypool.com'
	,	'mrlonline.org'
	,	'mrs.org'
	,	'msp.org'
	,	'msp.warwick.ac.uk'
	,	'multidataonline.com'
	,	'multilingual-matters.net'
	,	'mup.man.ac.uk'
	,	'muse.jhu.edu'
	,	'musicalamerica.com'
	,	'na.jkn21.com'
	,	'nanonetbase.com'
	,	'nationaljournal.com'
	,	'naturalstandard.com'
	,	'nature.com'
	,	'naxosmusiclibrary.com'
	,	'nber.org'
	,	'ncbi.nlm.nih.gov'
	,	'ncte.org'
	,	'nejm.org'
	,	'neoreviews.aapjournals.org'
	,	'netadvantage.standardandpoors.com'
	,	'netlibrary.com'
	,	'neurology.org'
	,	'neurosciencenetbase.com'
	,	'newamamanualofstyle.com'
	,	'newfirstsearch.oclc.org'
	,	'newisiknowledge.com'
	,	'newleftreview.org'
	,	'new-media-and-society.com'
	,	'news.infolinker.com.tw'
	,	'newsbank.com'
	,	'nexisuni.com'
	,	'nichigai.co.jp'
	,	'nii.ac.jp'
	,	'nknews.org'
	,	'nlx.com'
	,	'nmanet.org'
	,	'noaa.gov'
	,	'nomos-elibrary.de'
	,	'nowpublishers.com'
	,	'nplusonemag.com'
	,	'nrc.ca'
	,	'nrc-cnrc.gc.ca'
	,	'nrcresearchpress.com'
	,	'nt12.orbital.net'
	,	'ntis.gov'
	,	'nurimedia.co.kr'
	,	'nurseweek.com'
	,	'nursing.gr'
	,	'nursingworld.org'
	,	'nutrition.cabweb.org'
	,	'nutrition.org'
	,	'nutritionnetbase.com'
	,	'nybooks.com'
	,	'obesityresearch.org'
	,	'occenvmed.com'
	,	'occup-healthandsafetynetbase.com'
	,	'oeb.griffith.ox.ac.uk'
	,	'oecd-ilibrary.org'
	,	'oed.com'
	,	'oldenbourg-link.com'
	,	'ommbid.com'
	,	'online.sagepub.com'
	,	'onlinelibrary.wiley.com'
	,	'ontheboards.tv'
	,	'openbookpublishers.com'
	,	'opticsinfobase.org'
	,	'oriprobe.com'
	,	'ornl.gov'
	,	'osa.org'
	,	'osapublishing.org'
	,	'oup.co.uk'
	,	'oup.com'
	,	'oupjournals.org'
	,	'ovid.com'
	,	'oxfordartonline.com'
	,	'oxforddictionaries.com'
	,	'oxforddnb.com'
	,	'oxfordeconomics.com'
	,	'oxfordhandbooks.com'
	,	'oxfordislamicstudies.com'
	,	'oxfordjournals.org'
	,	'oxfordmedicine.com'
	,	'oxfordmusiconline.com'
	,	'oxfordreference.com'
	,	'oxfordscholarship.com'
	,	'oxfordwesternmusic.com'
	,	'palgrave-journals.com'
	,	'papers.nber.org'
	,	'pb.rcpsych.org'
	,	'pbr.psychonomic-journals.org'
	,	'pdcnet.org'
	,	'pediatricnursing.org'
	,	'pediatrics.org'
	,	'pedresearch.org'
	,	'pedsinreview.aapjournals.org'
	,	'perceptionweb.com'
	,	'perio.org'
	,	'pharmaceuticalnetbase.com'
	,	'pharmrev.org'
	,	'philologic.uchicago.edu'
	,	'phycologia.org'
	,	'physicsnetbase.com'
	,	'physiology.org'
	,	'physsportsmed.com'
	,	'pinatubo.ucop.edu'
	,	'pjm.math.berkeley.edu'
	,	'planningreport.com'
	,	'plantcell.org'
	,	'plantphysiol.org'
	,	'plantsciencenetbase.com'
	,	'plasreconsurg.com'
	,	'plunkettonline.com'
	,	'plunkettresearch.com'
	,	'plunkettresearchonline.com'
	,	'plunkettsonline.com'
	,	'pnas.org'
	,	'poj.peeters-leuven.be'
	,	'policymap.com'
	,	'polymersdatabase.com'
	,	'poolesplus.odyssi.com'
	,	'portico.org'
	,	'portlandpress.com'
	,	'postgradmed.com'
	,	'postgradmedj.com'
	,	'press.uiuc.edu'
	,	'primarysourcesonline.nl'
	,	'prl5.sdsc.edu'
	,	'products.asminternational.org'
	,	'projecteuclid.org'
	,	'projectmanagementnetbase.com'
	,	'proquest.com'
	,	'proquest.safaribooksonline.com'
	,	'proquestreference.com'
	,	'proteinscience.org'
	,	'proteome.com'
	,	'prsgroup.com'
	,	'psychiatrist.com'
	,	'psychiatryonline.com'
	,	'psychiatryonline.org'
	,	'psychotherapy.net'
	,	'ptjournal.org'
	,	'publications.chestnet.org'
	,	'publishing.cdlib.org'
	,	'pubmed.gov'
	,	'pubs.amstat.org'
	,	'pubs.nrc-cnrc.gc.ca'
	,	'pubsonline.informs.org'
	,	'qjps.com'
	,	'quintpub.com'
	,	'quod.lib.umich.edu'
	,	'r2library.com'
	,	'radiographics.rsnajnls.org'
	,	'radiology.rsnajnls.org'
	,	'raes.org.uk'
	,	'randstatestats.org'
	,	'rcjournal.com'
	,	'rdatoolkit.org'
	,	'reaxys.com'
	,	'referencecorp.com'
	,	'reference-global.com'
	,	'refuniv.odyssi.com'
	,	'refworks.reference-global.com'
	,	'residentandstaff.com'
	,	'reutersbusinessinsight.com'
	,	'revista-iberoamericana.pitt.edu'
	,	'rhe.eu.com'
	,	'ria.ie'
	,	'ria.thomson.com'
	,	'rkma.com'
	,	'rmp.aps.org'
	,	'rnajournal.org'
	,	'rocksbackpages.com'
	,	'romanistudies.org'
	,	'ropercenter.uconn.edu'
	,	'routledge.com'
	,	'routledgehandbooks.com'
	,	'routledgereligiononline.com'
	,	'royalsocietypublishing.org'
	,	'rsc.org'
	,	'rsmjournals.com'
	,	'rsna.org'
	,	'sabinet.co.za'
	,	'saemobilus.sae.org'
	,	'safari.informit.com'
	,	'safari.oreilly.com'
	,	'safundi.com'
	,	'sage-ereference.com'
	,	'sagepub.com'
	,	'samed.com'
	,	'samj.org.za'
	,	'sbrnet.com'
	,	'schattauer.de'
	,	'scholar.google.com'
	,	'scholarlyiq.com'
	,	'sciamarchive.org'
	,	'science.uwaterloo.ca'
	,	'sciencedirect.com'
	,	'sciencemag.org'
	,	'sciencenews.org'
	,	'science-of-synthesis.thieme.com'
	,	'scientific.net'
	,	'scifinder.cas.org'
	,	'scijournals.org'
	,	'scitation.org'
	,	'sci-technetbase.com'
	,	'sciverse.com'
	,	'scopus.com'
	,	'sd-editions.com'
	,	'search.marquiswhoswho.com'
	,	'search.rdsinc.com'
	,	'secure.peeters-leuven.be'
	,	'serialssolutions.com'
	,	'server.wenzibase.com'
	,	'shipindex.org'
	,	'siku.ad.sdsc.edu'
	,	'silverplatter.com'
	,	'simplymap.com'
	,	'sinica.edu.tw'
	,	'site.ebrary.com'
	,	'site.securities.com'
	,	'slavery.amdigital.co.uk '
	,	'sloanreview.mit.edu'
	,	'sma.org'
	,	'smf4.emath.fr'
	,	'soci.org'
	,	'socialexplorer.com  '
	,	'software.chem.ucla.edu'
	,	'sourceoecd.org'
	,	'spie.org'
	,	'spiedigitallibrary.org'
	,	'spiedl.org'
	,	'spin.infoedglobal.com'
	,	'spleen.uchicago.edu'
	,	'springer.com'
	,	'springerlink.com'
	,	'springeronline.com'
	,	'springerprotocols.com'
	,	'spuc.egreenapple.com'
	,	'srds.com'
	,	'ssrn.com'
	,	'stacks.iop.org'
	,	'statab.conquestsystems.com'
	,	'statista.com'
	,	'statref.com'
	,	'statsnetbase.com'
	,	'stat-usa.gov'
	,	'stemcells.com'
	,	'stephanus.tlg.uci.edu'
	,	'stke.org'
	,	'strauss.library.ucla.edu'
	,	'structure.org'
	,	'subscriber.pagesuite-profess'
	,	'swcstore.oit.ucla.edu'
	,	't21.nikkei.co.jp'
	,	'taiwanclassic.com'
	,	'tandf.co.uk'
	,	'tandfonline.com'
	,	'tapor.library.utoronto.ca'
	,	'tax.cchgroup.com'
	,	'taylorandfrancis.com'
	,	'taylorfrancis.com'
	,	'tbrc.org'
	,	'tcrecord.org'
	,	'telecommunicationsnetbase.com'
	,	'textilenetbase.com'
	,	'thecochranelibrary.com'
	,	'thejns.org'
	,	'theoncologist.com'
	,	'therapeuticresearch.com'
	,	'the-tls.co.uk'
	,	'thieme.com'
	,	'thieme.de'
	,	'thieme-chemistry.com'
	,	'thieme-connect.com'
	,	'thomastelford.com'
	,	'thomsonhc.com'
	,	'thomsonreuters.com'
	,	'thoraxjnl.com'
	,	'tlg.uci.edu'
	,	'tmsoc.org'
	,	'tol.cz'
	,	'toxicologynetbase.com'
	,	'transfusion.org'
	,	'tribologynetbase.com'
	,	'tripdatabase.com'
	,	'trrjournalonline.trb.org'
	,	'turpion.org'
	,	'tvnews.vanderbilt.edu'
	,	'twst.com'
	,	'uair.arizona.edu'
	,	'ucelinks.cdlib.org'
	,	'ucill.cdlib.org'
	,	'ucla.naxosmusiclibrary.com'
	,	'uclajournals.org'
	,	'uclosangeles.classical.com'
	,	'uclosangeles2.classical.com'
	,	'uclosangeles4.classical.com'
	,	'ucpress.edu'
	,	'udndata.com'
	,	'ulrichsweb.com'
	,	'umdl.umich.edu'
	,	'umi.com'
	,	'unige.ch'
	,	'universitypressscholarship.com'
	,	'universitypublishingonline.org'
	,	'uniworldbp.com '
	,	'uniworldonline.com'
	,	'untreaty.un.org'
	,	'updateusa.com'
	,	'uptodate.com'
	,	'vandenhoeck-ruprecht.de'
	,	'vertigomagazine.co.uk'
	,	'vet.cabweb.org'
	,	'veterinaryrecord.bvapublications.com'
	,	'vir.sgmjournals.org'
	,	'visualdx.com'
	,	'voices.revealdigital.com'
	,	'wanfangdata.com'
	,	'water.usgs.gov'
	,	'waternetbase.com'
	,	'wbaonline.co.uk'
	,	'webcsd.ccdc.cam.ac.uk'
	,	'webofknowledge.com '
	,	'webreports.net'
	,	'wef.org'
	,	'whitston.com'
	,	'wisenews.wisers.net'
	,	'wkap.nl'
	,	'wkhealth.com'
	,	'wms.cartographic.com'
	,	'wnc.dialog.com'
	,	'wolterskluwer.com'
	,	'worldbank.org'
	,	'worldcat.org'
	,	'worldoflearning.com'
	,	'worldscinet.com'
	,	'worldshakesbib.org'
	,	'wwo.wwp.northeastern.edu'
	,	'xipolis.net'
	,	'yomiuri.co.jp'
	,	'zephyr.bvdep.com'
	,	'zephyrdealdata.com'
	];
	if (surveyableDomains.contains(domain)) surveyable = true;
	return surveyable;
}
	
function isLibraryDomain(domain) {
	// Returns true if domain contains library.ucla.edu (case insensitive)
	return(domain.toUpperCase().indexOf('LIBRARY.UCLA.EDU') >= 0);
}

function redirectLink(link) {
	var href = link.href;
	if (! href) return false;
	href = escape(href);
	var target = 'http://unitproj.library.ucla.edu/lis/libweb/lcas_router.cfm';
	target += '?target=' + href;
	// alert('DEBUG: Target ' + target);
	window.location = target;
}
  
function hookLinks() {
	var thisDomain = window.location.hostname;
/*
    // Summon uses spans with link attributes, not real HTML <a> links
    if (thisDomain.indexOf("summon.serialssolutions.com") > 0) {
      hookSummon();
    }
*/
    // For real HTML....
	var links = document.getElementsByTagName("a");
	for (var i = 0; i < links.length; i++) {
		var link = links[i];
		// IE has problems with some possibly-invalid links which real browsers can  handle, so check and skip if needed
		try {
			var domain = link.hostname;
			// bail out on special cases
			if (domain == null) continue;
			// hook into surveyable links, but exclude ones on the same domain
			if ( isDomainSurveyable(link) && (thisDomain != domain) ) {
				// alert('DEBUG: Adding click event for ' + link);
				addClickEvent(link, redirectLink, false); // addClickEvent adds call to redirectLink(link) to click event
			}
			// addEvent(link, 'click', redirectLink); //works, except link is still followed
			// Can't use generic addEvent() because we need to change link.onclick, not just add a new event to it
			// Must ensure that onclick returns false so the original link is not followed
		}
		catch (e) {} // we don't care about the error, just want to keep it from breaking things
	}
}

/*
// This is not working.......
function hookSummon() {
  // Summon uses spans with link attributes, not real HTML <a> links
  var links = document.querySelectorAll("span[link]");
  for (var i = 0; i < links.length; i++) {
    var link = links[i].getAttribute("link");
    if (link.indexOf("link/0") > 0) {
	    alert(link);
	    addClickEvent(link, redirectLink, false);
    }
  }
}
*/

// If it's time for the survey, hook relevant links to redirect to the survey system
if (isSurveyTime() ) {
	// If this is a library page we care about, and survey cookies aren't already set, redirect to the survey
	// 2014: I think this is no longer relevant as we're not surveying library pages themselves, but links on them...
	if ( isDomainSurveyable()  && (! getCookie('LIBCOSTSURVEY_EXPIRES') || ! getCookie('LIBCOSTSURVEY_SESSIONID'))) {
		redirectLink(parent.location); // pick up framed content correctly, instead of window.location which is current frame only
	}

	// alert("DEBUG: It's survey time!");
	addEvent(window, 'load', hookLinks);
	
	// Override function from Ex Libris highLight.js file; theirs breaks our link hooking
	// But only override during survey time
	highlightRecordDisplay = function(searchTerms) {
		return false;
	}
}
