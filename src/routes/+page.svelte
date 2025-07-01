<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import type { PageData } from './$types';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	let { data }: { data: PageData } = $props();
	type Project = {
		title: string;
		description: string;
		skills: string[];
	};
	const projects: Project[] = [
		{
			title: 'Wedding RSVP Platform',
			description:
				'Full-stack web application with custom domain deployment to handle guest management for my wedding. Featuring an admin dashboard for tracking invitation metrics, invitation/guest management, attendance count, and PostgreSQL database integration.',
			skills: [
				'SvelteKit',
				'Svelte',
				'Vercel',
				'Docker',
				'TypeScript',
				'Tailwind CSS',
				'Authentication',
				'Custom API',
				'Drizzle ORM',
				'PostgreSQL'
			]
		},
		{
			title: 'Personal Website',
			description:
				'Implemented advanced search functionality running on a web worker, dynamic content routing, and a custom API. Focused on responsive design for enhanced user experience and deployed on CloudFlare Workers.',
			skills: [
				'SvelteKit',
				'Svelte',
				'TypeScript',
				'Tailwind CSS',
				'CloudFlare Workers',
				'Web Workers',
				'Dynamic Routes',
				'Responsive Design',
				'Custom API'
			]
		},
		{
			title: 'Home Lab Infrastructure',
			description:
				'Virtualized environment built on Proxmox hypervisor, hosting various services including a high-availability Kubernetes cluster, XDR security system, and a public-facing game server with robust networking and DNS management.',
			skills: [
				'Proxmox',
				'LXC Containers',
				'Security and Monitoring',
				'Networking',
				'K0s (Kubernetes)',
				'Linux (various)',
				'DNS'
			]
		},
		{
			title: 'Wazuh',
			description:
				'Implemented enterprise-grade SIEM solution using Wazuh for real-time threat detection, log analysis, and security incident response across multi-platform environments with comprehensive system hardening protocols.',
			skills: [
				'Wazuh',
				'System hardening',
				'SIEM',
				'Linux (RedHat)',
				'Windows',
				'Security best practices',
				'Group Policy'
			]
		},
		{
			title: 'High-Availability Gaming Server',
			description:
				'Deployed a public Minecraft server with 99.9% uptime, featuring automated incremental backups, public monitoring and announcement dashboard, zero-trust network access, and optimized resource management.',
			skills: [
				'Linux (Debian)',
				'Incremental Backups',
				'Systemd Services',
				'Cron Jobs',
				'SSH Hardening',
				'Monitoring (Uptime Kuma)',
				'Zero-Trust Access Control (TwinGate)',
				'Documentation',
				'Cloudflare Tunnel',
				'Resource Management + Optimization'
			]
		},
		{
			title: 'Cricket Analytics Pipeline',
			description:
				'Automated web scraping system extracting comprehensive cricket match statistics from ESPN Cricinfo, processing thousands of data points for sports analytics and performance insights using scrapy.',
			skills: ['Web Scraping', 'Data Wrangling', 'Python', 'Scrapy']
		},
		{
			title: 'Arctic Climate Research Platform',
			description:
				'Automated data collection from Arctic river monitoring systems, performed statistical analysis workflows, and data visualization for arctic river research.',
			skills: [
				'Python',
				'Pandas',
				'Scrapy',
				'Matplotlib',
				'Data Scraping',
				'Data Wrangling',
				'Data Exploration',
				'Jupyter Notebooks'
			]
		}
	];
</script>

<section class="prose">
	<p class="mt-0">
		Hi, I'm Carlos and I enjoy exploring new technologies and building custom solutions. I'm
		interested in a little bit of everything, but mainly cybersecurity, software development, and
		data science. In my free time, I like to work on personal projects, learn new tools/skills, and
		stay updated with industry trends.
	</p>
	<p>
		I'm currently focused on enhancing my skills in these areas. This website serves as a portfolio
		of my work and a place for me to share my learning journey. The <a href="/articles">articles</a>
		section contains more polished content, while the <a href="/notes">notes</a> section contains my
		raw thoughts and study notes. Lastly, the <a href="/finds">finds</a> section contains interesting
		things, like tools and technologies, that I want to keep track of and share.
	</p>
	<p>
		A lot of what I've learned has come from personal projects, self-directed learning, and
		coursework projects. The most significant ones being:
	</p>
</section>
<section class="my-8">
	<Carousel.Root class="sm:mx-12" opts={{ loop: true }}>
		<Carousel.Content>
			{#each projects as project}
				<Carousel.Item class="basis-80 md:basis-85">
					<Card.Root class="min-h-full">
						<Card.Header>
							<Card.Title>{project.title}</Card.Title>
							<Card.Description>
								{project.description}
							</Card.Description>
						</Card.Header>
						<Card.Content class="flex flex-wrap gap-2">
							{#each project.skills as skill}
								<Badge variant="secondary">{skill}</Badge>
							{/each}
						</Card.Content>
					</Card.Root>
				</Carousel.Item>
			{/each}
		</Carousel.Content>
		<Carousel.Previous class="hidden sm:inline-flex" />
		<Carousel.Next class="hidden sm:inline-flex" />
	</Carousel.Root>

	<p class="mt-6 prose">
		You can check out my current and past projects on <a
			href="https://github.com/CarlosGTrejo"
			target="_blank">GitHub</a
		>.
	</p>
</section>
